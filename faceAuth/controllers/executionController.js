const sandboxService = require("../services/sandboxService");

exports.runCode = async (req, res) => {
  const { code, language } = req.body;
  try {
    const output = await sandboxService.runCodeInSandbox(code, language);
    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
