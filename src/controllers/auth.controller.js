const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

exports.login = asyncHandler(async (req, res) => {
  const { admin, token } = await authService.login(req.body.email, req.body.password, req);
  res.json({ success: true, data: { admin, token } });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.json({ success: true, ...result });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  res.json({ success: true, ...result });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

exports.getAdmins = asyncHandler(async (req, res) => {
  const admins = await authService.getAdmins();
  res.json({ success: true, data: admins });
});

exports.createAdmin = asyncHandler(async (req, res) => {
  const admin = await authService.createAdmin(req.body, req.admin, req);
  res.status(201).json({ success: true, data: admin });
});

exports.updateAdmin = asyncHandler(async (req, res) => {
  const admin = await authService.updateAdmin(req.params.id, req.body, req.admin, req);
  res.json({ success: true, data: admin });
});

exports.resetAdminPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetAdminPassword(
    req.params.id,
    req.body.password,
    req.admin,
    req
  );
  res.json({ success: true, ...result });
});
