@echo off
echo Adding Windows Firewall rule for ExpenseAI Port 5000...
netsh advfirewall firewall delete rule name="ExpenseAI Port 5000" >nul 2>&1
netsh advfirewall firewall add rule name="ExpenseAI Port 5000" protocol=TCP dir=in localport=5000 action=allow profile=private,domain
echo.
echo Done! Port 5000 is now open for your phone.
pause
