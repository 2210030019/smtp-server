# NodeMail — SMTP Mail Server from Scratch
 
I built this project because I wanted to understand exactly how email works under the hood. Instead of just using an existing SMTP library like Nodemailer, I decided to build my own mail server from scratch using Node.js's raw `net` module to know exactly what happens at every step.
 
This simulates how real mail servers like Gmail work — TCP connections, SMTP conversations, MX lookups, spam filtering and DKIM signing — all implemented manually without any magic libraries hiding the details.
 
---
 
## Why nodemail.local and not a real domain?
 
Building a real mail server that sends to Gmail or Yahoo requires:
- A real domain (like nodemail.xyz) with proper DNS records
- A VPS with a static public IP
- Port 25 open (most ISPs block this at home)
- SPF, DKIM and MX records configured in DNS
Since this is a learning project, I used `nodemail.local` as a display name in the SMTP conversation. Everything runs on localhost so no extra configuration needed. The full SMTP flow, MX lookup, DKIM signing and verification all work exactly the same way, just pointed at localhost instead of the real internet. The code itself is production-level, just missing the DNS layer on top.
 
---
 
## Features
 
- Raw TCP server on port 25 built with Node.js `net` module
- Full SMTP conversation handling — EHLO, MAIL FROM, RCPT TO, DATA, QUIT
- Session management to track each connection's state
- MX record lookup to find the correct mail server for a domain
- Spam filtering — blocks suspicious keywords and sender domains
- DKIM signing and verification using RSA key pairs via Node.js `crypto` module
- Emails saved as JSON files to disk
- Express REST API to send and read emails
---
 
## Tech Stack
 
- Node.js
- Express.js
- `net` module — raw TCP server
- `dns/promises` module — MX record lookup
- `crypto` module — RSA key generation, DKIM signing and verification
- `fs` module — email storage
- `chalk` — colored terminal logs
- `dotenv` — environment variables
---
 
## Prerequisites
 
- Node.js v18 or above
- Git
---
 
## Installation
 
```bash
git clone https://github.com/2210030019/smtp-server.git
cd smtp-server
npm install
```
 
---
 
## Setup
 
**1. Create a `.env` file in the root:**
 
```env
SMTP_PORT=25
DOMAIN=nodemail.local
SMTP_HOST=mail.nodemail.local
EXPRESS_PORT=3000
```
 
**2. Generate RSA keys for DKIM — run this once:**
 
```bash
node generateKeys.js
```
 
This creates `keys/private.pem` and `keys/public.pem` in your project root.
 
---
 
## Running the Project
 
```bash
node index.js
```
 
This starts both the SMTP server on port 25 and the Express API on port 3000 simultaneously.
 
---
 
## API Usage
 
**Send an email:**
 
```http
POST http://localhost:3000/send-mail
Content-Type: application/json
 
{
  "from": "harshita@nodemail.local",
  "to": "john@nodemail.local",
  "data": "Subject: Hello!\n\nHey John, just testing the mail server!"
}
```
 
**Read all received emails:**
 
```http
GET http://localhost:3000/inbox
```
 
---
 
## Testing via Terminal (Raw SMTP)
 
You can also test the SMTP server directly using Git Bash:
 
```bash
nc localhost 25
```
 
Then type the SMTP conversation manually:
 
```
EHLO nodemail.local
MAIL FROM:<harshita@nodemail.local>
RCPT TO:<john@nodemail.local>
DATA
Subject: Hello John!
 
This is a test email.
.
QUIT
```
 
Note: emails sent this way will be rejected by DKIM verification since they are not signed. This is expected behavior — only emails sent through the API are properly signed.
 
---
 
## How it Works
 
```
Client hits POST /send-mail
        ↓
smtpClient.js signs email with private key (DKIM)
        ↓
Opens TCP connection to destination server on port 25
        ↓
Full SMTP conversation: EHLO → MAIL FROM → RCPT TO → DATA → QUIT
        ↓
smtpServer.js receives the email
        ↓
Extracts and verifies DKIM signature using public key
        ↓
Runs spam filter checks
        ↓
Saves email as JSON to emails/ folder
```
 
---
 
## What I Learned
 
Building this project taught me more about how the internet actually works than anything else I've done. TCP connections, DNS resolution, cryptographic signing and email protocols went from theory to things I actually implemented myself.
 