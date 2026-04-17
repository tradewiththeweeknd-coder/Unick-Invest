const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Gerar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Gerar Referral Code
const generateReferralCode = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// REGISTER - Criar nova conta
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, mobileMoneyAccount, accountNumber, pin } = req.body;

    // Validações
    if (!name || !email || !phone || !password || !mobileMoneyAccount || !accountNumber || !pin) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já registrado' });
    }

    // Criar novo usuário
    const user = new User({
      name,
      email,
      phone,
      password,
      mobileMoneyAccount,
      accountNumber,
      pin,
      referralCode: generateReferralCode()
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN - Fazer login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Conta bloqueada' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VERIFY PIN - Verificar PIN para operações sensíveis
exports.verifyPin = async (req, res) => {
  try {
    const { userId, pin } = req.body;

    if (!userId || !pin) {
      return res.status(400).json({ error: 'User ID e PIN são obrigat��rios' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Comparar PINs (ambos devem estar hash)
    const pinMatch = await bcrypt.compare(pin, user.pin);
    if (!pinMatch) {
      return res.status(401).json({ error: 'PIN incorreto' });
    }

    res.json({ success: true, message: 'PIN verificado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};