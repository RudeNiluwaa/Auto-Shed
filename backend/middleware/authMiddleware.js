import jwt from 'jsonwebtoken';

const isAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.user || decoded.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied, not an admin' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default isAdmin;
