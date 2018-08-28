d = new dTree('d');

var nIndex = 0;

d.add(nIndex++,-1,'HyperGateway Console');

var nConfigure = nIndex;
d.add(nIndex++,0,'Configure','main.html', 'Configure Hardware Card Settings' );

var nMonitor = nIndex;
d.add(nIndex++,0,'Monitor','main.html', 'View Real Time Status' );

var nManage = nIndex;
d.add(nIndex++,0,'Manage','main.html', 'Manage users & resources' );

// /configure
var nCellCardConfig = nIndex;
d.add(nIndex++,nConfigure,'Cellular Cards', 'main.html', 'Configure Cellular Card Settings' );

var sms_server_group = nIndex;
d.add(nIndex++, nConfigure, 'SMS Server', 'main.html', 'SMS Server' );

var hyperguard_group = nIndex;
d.add(nIndex++, nConfigure, 'HyperGuard', 'main.html', 'Configure HyperGuard' );

var nServerSettings = nIndex;
d.add(nIndex++,nConfigure,'Server Settings', 'main.html', 'Change Server Settings' );

d.add(nIndex++,nConfigure,'Save All', 'screens/SaveLoad.html' );
d.add(nIndex++,nConfigure,'Backup/Restore', 'screens/BackupRestore.html' );
d.add(nIndex++,nConfigure,'Diagnostics', 'screens/Diagnostics.html' );

// /configure/sms server

d.add(nIndex++, sms_server_group, 'License', 'screens/sms-license.html');
d.add(nIndex++, sms_server_group, 'User List','screens/Manage-Userlist-sms.html' );
d.add(nIndex++, sms_server_group, 'Web License', 'screens/websms-license.html');
d.add(nIndex++, sms_server_group, 'Configuration', 'screens/sms-configuration.html');
d.add(nIndex++, sms_server_group, 'Prefixes Replacements', 'screens/sms-prefixes.html');
d.add(nIndex++, sms_server_group, 'Channel Selection', 'screens/sms-channel-selection.html');
d.add(nIndex++, sms_server_group, 'SMSC To Group ', 'screens/sms-group2smsc.html');
d.add(nIndex++, sms_server_group, 'Spam Pass', 'screens/sms-spam-trap.html' );
d.add(nIndex++, sms_server_group, 'DLR Conversion', 'screens/sms-dlr-conv.html' );
d.add(nIndex++, sms_server_group, 'SMS Sender', 'screens/sms-sender.html' );
d.add(nIndex++, sms_server_group, 'ACR Rules', 'screens/sms-acr-rules.html' );
d.add(nIndex++, sms_server_group, 'ACR Number Lists', 'screens/sms-acr-number-lists.html' );
d.add(nIndex++, sms_server_group, 'Counters', 'screens/sms-counter.html' );
d.add(nIndex++, sms_server_group, 'Slaves Manager', 'screens/sms-slaves-manager.html' );

// /configure/server settings

d.add(nIndex++,nServerSettings,'HMC Password', 'screens/Srv-Settings-Password.html' );

// /monitor

var nCellCardMonitor = nIndex;
d.add(nIndex++,nMonitor,'Cellular Cards', 'main.html' ,'Monitor Cellular Card Operation' );

d.add(nIndex++, nMonitor, 'SMS CDRs', 'screens/SMS-Logs.html' );

var nSMSMonitor = nIndex;
d.add(nIndex++,nMonitor,'SMS Server','main.html', 'Monitor SMS Server' );


// /monitor/cellular cards

d.add(nIndex++,nCellCardMonitor,'All Cells','screens/CGW-WideAngle.html');
d.add(nIndex++,nCellCardMonitor,'Reception','screens/CGW-Receptions.html');
d.add(nIndex++,nCellCardMonitor,'Status','screens/CGW-Status.html');

// /monitor/sms server

d.add(nIndex++,nSMSMonitor,'Queue Manage','screens/sms-q-manage.html');
d.add(nIndex++,nSMSMonitor,'Client Monitor','screens/sms-client-monitor.html');
d.add(nIndex++,nSMSMonitor,'Client History','screens/sms-client-history.html');
d.add(nIndex++,nSMSMonitor,'System Connection','screens/sms-master-slave-monitor.html');

// random mess

d.add(nIndex++,nCellCardConfig,'PIN Codes','screens/CGW-PINCodes.html');
d.add(nIndex++,nCellCardConfig,'MSN Values','screens/CGW-MSNValues.html');
d.add(nIndex++,nCellCardConfig,'Reset','screens/CGW-Reset.html');
d.add(nIndex++,nCellCardConfig,'Module Info','screens/CGW-ModulesInfo.html');
d.add(nIndex++,nCellCardConfig,'Locks','screens/CGW-Locks.html');
d.add(nIndex++,nCellCardConfig,'SIM Select','screens/CGW-MultiSIM.html');
d.add(nIndex++,nCellCardConfig,'Serial Numbers','screens/CGW-SerialNums.html');
d.add(nIndex++,nCellCardConfig,'Cell Selection','screens/CGW-CellSelection.html');
d.add(nIndex++,nCellCardConfig,'Settings','screens/CGW-Settings.html');
d.add(nIndex++,nCellCardConfig,'Network Parameters','screens/CGW-NetParams.html');
d.add(nIndex++,nCellCardConfig,'USSD SIM balance','screens/CGW-USSD.html');

d.add(nIndex++,nManage,'License', 'screens/licensing.html' );
d.add(nIndex++,nManage,'Number Filters','screens/Manage-NumFilters.html');
d.add(nIndex++,nManage,'Scheduler','screens/Manage-Scheduler.html');
d.add(nIndex++,nManage,'HGS Logs','screens/Admin-Logs.html');

// /configure/hyperguard
d.add(nIndex++, hyperguard_group, 'License', 'screens/hyperguard-license.html' );
d.add(nIndex++, hyperguard_group, 'VCG Plus', 'screens/hyperguard-vcg.html' );
d.add(nIndex++, hyperguard_group, 'EMS Plus', 'screens/hyperguard-imei.html' );