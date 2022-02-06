# bot-template
Standard issue bot template with the following features:
- Database Support
- Slash Command Support
- Config Channel
- Admin Role
- Administrative commands
- Multi-Server Support

### Debugging
It turns out you can use curl and a standard issue bot token to call up every necessary endpoint,<br>
this is particularly helpful when working with slash commands since it allows you to view values in plain text.
```
curl -H "Authorization: Bot <your-bot-token-goes-here>" https://discord.com/api/v9/channels/<channel-id>            
```

### Installation
Install Node.js Version 16 on your server, set up a database, copy the files onto the server.<br>
Preferred directory for that would be```/opt/bot-template/``` and run ```chmod +rwx /opt/bot-template/ -R```<br>
You find a Systemd Service file in the config folder, copy it into the ```/etc/systemd/system/``` folder.<br>
Set up a user, ``useradd bot-template -MNr`` and modify the service file accordingly.<br>
Run ```systemctl daemon-reload; systemctl enable bot_template; systemctl start bot_template```
