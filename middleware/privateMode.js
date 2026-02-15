// Private Mode - Password protect entire site during development
const SITE_PASSWORD = process.env.SITE_PASSWORD;

const privateAccessPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Private Site - Access Required</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .access-box {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 100%;
        }
        .lock-icon {
            width: 60px;
            height: 60px;
            background: #667eea;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 30px;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 24px;
        }
        p {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .error {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            display: none;
        }
        .error.show { display: block; }
    </style>
</head>
<body>
    <div class="access-box">
        <div class="lock-icon">🔒</div>
        <h1>Private Site</h1>
        <p>This site is currently in development mode.<br>Please enter the access password.</p>
        
        <div class="error" id="error">Invalid password. Please try again.</div>
        
        <form id="accessForm">
            <div class="form-group">
                <label for="password">Access Password</label>
                <input type="password" id="password" name="password" required autofocus>
            </div>
            <button type="submit">Enter Site</button>
        </form>
    </div>
    
    <script>
        document.getElementById('accessForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const error = document.getElementById('error');
            
            try {
                const response = await fetch('/site-access', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });
                
                if (response.ok) {
                    window.location.reload();
                } else {
                    error.classList.add('show');
                    document.getElementById('password').value = '';
                }
            } catch (err) {
                error.classList.add('show');
            }
        });
    </script>
</body>
</html>
`;

const privateModeMiddleware = (req, res, next) => {
    // Skip if no password is set (site is public)
    if (!SITE_PASSWORD) {
        return next();
    }
    
    // Skip password check for access page itself
    if (req.path === '/site-access') {
        return next();
    }
    
    // Check if user has valid access cookie
    if (req.cookies.siteAccess === SITE_PASSWORD) {
        return next();
    }
    
    // Show access page
    return res.send(privateAccessPage);
};

const handleSiteAccess = (req, res) => {
    const { password } = req.body;
    
    if (password === SITE_PASSWORD) {
        res.cookie('siteAccess', password, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        return res.json({ success: true });
    }
    
    return res.status(401).json({ error: 'Invalid password' });
};

module.exports = {
    privateModeMiddleware,
    handleSiteAccess
};
