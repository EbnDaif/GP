const Docker = require("dockerode");
const docker = new Docker();

const escapeCode = (code) => {
  return code
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/'/g, "'\\''") // Escape single quotes
    .replace(/\n/g, "\\n"); // Escape newlines
};

const languageConfigs = {
  c: {
    image: "gcc:latest",
    cmd: (code) =>
      `/bin/bash -c 'echo "${escapeCode(
        code
      )}" > /code.c && gcc /code.c -o /code.out && ./code.out 2>&1 | cat -v'`,
  },
  cpp: {
    image: "gcc:latest",
    cmd: (code) =>
      `/bin/bash -c 'echo "${escapeCode(
        code
      )}" > /code.cpp && g++ /code.cpp -o /code.out && ./code.out 2>&1 | cat -v'`,
  },
  python: {
    image: "online-code-compiler:latest",
    cmd: (code) =>
      `/bin/bash -c 'echo "${escapeCode(
        code
      )}" > /code.py && python /code.py 2>&1 | cat -v'`,
  },
  javascript: {
    image: "node:latest",
    cmd: (code) =>
      `/bin/bash -c 'echo "${escapeCode(
        code
      )}" > /code.js && node /code.js 2>&1 | cat -v'`,
  },
  java: {
    image: "openjdk:latest",
    cmd: (code) =>
      `/bin/bash -c 'echo "${escapeCode(
        code
      )}" > /Main.java && javac /Main.java && java Main 2>&1 | cat -v'`,
  },
};

exports.runCodeInSandbox = async (code, language) => {
  const config = languageConfigs[language];
  if (!config) {
    throw new Error("Unsupported language");
  }

  let container;
  try {
    container = await docker.createContainer({
      Image: config.image,
      Cmd: ["/bin/bash", "-c", config.cmd(code)],
      Tty: false,
    });

    await container.start();

    return new Promise((resolve, reject) => {
      let output = "";

      container.attach(
        { stream: true, stdout: true, stderr: true },
        (err, stream) => {
          if (err) {
            console.error("Attach error:", err);
            return reject(err);
          }

          stream.on("data", (data) => {
            output += data.toString();
          });

          stream.on("end", async () => {
            try {
              // Log raw output for debugging
              console.log("Raw container output:", output);

              // Sanitize output
              const sanitizedOutput = output.replace(
                /\x1b[[(?;]{0,2}[0-9]*m/g,
                ""
              ); // Remove ANSI escape codes
              console.log("Sanitized container output:", sanitizedOutput); // Debugging output
              await container.remove();
              resolve(sanitizedOutput);
            } catch (removeErr) {
              reject(removeErr);
            }
          });

          stream.on("error", async (err) => {
            try {
              await container.remove();
              reject(err);
            } catch (removeErr) {
              reject(removeErr);
            }
          });
        }
      );
    });
  } catch (err) {
    if (container) {
      try {
        await container.remove();
      } catch (removeErr) {
        console.error("Container removal error:", removeErr);
      }
    }
    throw err;
  }
};
