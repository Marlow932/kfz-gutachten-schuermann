# Wird in jedem server-/location-Block eingebunden (nginx vererbt add_header nicht in Blöcke mit eigenen add_header)
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self' https://api.web3forms.com; form-action 'self' https://api.web3forms.com; frame-ancestors 'self'; base-uri 'self'; object-src 'none'" always;
