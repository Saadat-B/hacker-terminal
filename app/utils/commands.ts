// List of fake commands and messages for the hacker terminal
const fakeCommands = [
  'sudo nmap -sS 192.168.1.1',
  'ssh root@10.0.0.1',
  'ping -c 4 target-server.net',
  'traceroute darkweb.onion',
  'sudo apt-get install hacking-tools',
  'openssl enc -aes-256-cbc -salt -in secrets.txt -out secrets.enc',
  'for i in {1..10}; do curl -s http://target-site.com/$i; done',
  'hydra -l admin -P rockyou.txt 10.0.0.1 ssh',
  'grep -r "password" /var/www/html/',
  'nc -lvp 4444',
  'cd /root/backdoor && python3 exploit.py',
  'echo "#!/bin/bash\\nrm -rf /" > bad_script.sh',
  'chmod +x inject.sh && ./inject.sh',
  'git clone https://github.com/hackers/toolkit.git',
  'airmon-ng start wlan0',
  'hashcat -m 0 -a 0 hashes.txt wordlist.txt',
  'sqlmap -u "http://example.com/page?id=1" --dbs',
  'sudo tcpdump -i eth0 port 80',
  'tar -czvf backup.tar.gz /home/user/important',
  'ffuf -w wordlist.txt -u http://target.com/FUZZ',
  'nikto -host scanme.nmap.org'
];

// System messages that appear randomly
const systemMessages = [
  'Initializing secure connection...',
  'Access granted to level 3 systems',
  'Decrypting secure files...',
  'Bypassing firewall...',
  'Successfully penetrated the mainframe',
  'Downloading sensitive data: 34%',
  'Clearing system logs...',
  'Establishing backdoor connection...',
  'Database injection successful',
  'Exploiting CVE-2023-1337...',
  'IP address successfully masked',
  'Enumerating system services...',
  'Bypassing 2FA authentication...',
  'Privilege escalation in progress...',
  'Extracting credentials from memory',
  'Intercepting network traffic',
  'Cracking password hashes...',
  'Detecting intrusion countermeasures',
  'Payload successfully delivered',
  'Scanning for vulnerable endpoints'
];

// Progress indicators to make it look like something is happening
const progressIndicators = [
  '[======================>] 100% Complete',
  '[================>     ] 75% Complete',
  '[=========>            ] 50% Complete',
  '[====>                 ] 25% Complete',
  '[===>                  ] 23% Complete',
  '[======================>.........]',
  '10% ... 20% ... 54% ... 89% ... 100%',
  'Processing: #################### DONE!',
  'Loading modules: 12 of 15 loaded',
  'Connection established on port 443'
];

// Command output mappings - realistic output for specific commands
const commandOutputs: Record<string, string[]> = {
  'sudo nmap -sS 192.168.1.1': [
    'Starting Nmap 7.93 ( https://nmap.org ) at 2023-11-02 15:21 UTC',
    'Nmap scan report for 192.168.1.1',
    'Host is up (0.0042s latency).',
    'Not shown: 995 closed ports',
    'PORT     STATE SERVICE',
    '22/tcp   open  ssh',
    '80/tcp   open  http',
    '443/tcp  open  https',
    '8080/tcp open  http-proxy',
    '9000/tcp open  cslistener'
  ],
  'ping -c 4 target-server.net': [
    'PING target-server.net (203.0.113.10) 56(84) bytes of data.',
    '64 bytes from 203.0.113.10: icmp_seq=1 ttl=55 time=28.9 ms',
    '64 bytes from 203.0.113.10: icmp_seq=2 ttl=55 time=30.1 ms',
    '64 bytes from 203.0.113.10: icmp_seq=3 ttl=55 time=27.8 ms',
    '64 bytes from 203.0.113.10: icmp_seq=4 ttl=55 time=29.5 ms',
    '--- target-server.net ping statistics ---',
    '4 packets transmitted, 4 received, 0% packet loss, time 3005ms',
    'rtt min/avg/max/mdev = 27.835/29.091/30.129/0.923 ms'
  ],
  'ssh root@10.0.0.1': [
    'The authenticity of host \'10.0.0.1\' can\'t be established.',
    'ECDSA key fingerprint is SHA256:DtbDibK9NZ94xjlTCRN2XQii5Qu3htbhA+UZ0TGc2qY.',
    'Are you sure you want to continue connecting (yes/no/[fingerprint])? yes',
    'Warning: Permanently added \'10.0.0.1\' (ECDSA) to the list of known hosts.',
    'root@10.0.0.1\'s password: ********',
    'Last login: Mon Oct 30 03:23:10 2023 from 192.168.0.5',
    'Linux server 5.15.0-89-generic #99-Ubuntu SMP x86_64',
    'You have mail.',
    'root@server:~# '
  ]
};

/**
 * Generates a random fake command or system message
 */
export const generateCommand = (): string => {
  // Randomly choose between a command, message, or progress indicator
  const type = Math.floor(Math.random() * 10);
  
  if (type < 5) {
    // 50% chance of command
    return fakeCommands[Math.floor(Math.random() * fakeCommands.length)];
  } else if (type < 8) {
    // 30% chance of system message
    return systemMessages[Math.floor(Math.random() * systemMessages.length)];
  } else {
    // 20% chance of progress indicator
    return progressIndicators[Math.floor(Math.random() * progressIndicators.length)];
  }
};

/**
 * Gets realistic output for a specific command, or generates random output
 * @param command The command to get output for
 * @param numLines Number of output lines to return
 */
export const getCommandOutput = (command: string, numLines: number = 1): string[] => {
  // Check if we have predefined output for this command
  if (command in commandOutputs) {
    const output = commandOutputs[command];
    // If we have more lines than requested, randomly select a subset
    if (output.length > numLines) {
      if (numLines === 1) {
        return [output[Math.floor(Math.random() * output.length)]];
      } else {
        // Return first line and some random lines from the output
        const startIndex = Math.floor(Math.random() * (output.length - numLines));
        return output.slice(startIndex, startIndex + numLines);
      }
    }
    return output;
  }
  
  // If no predefined output, generate random outputs
  const outputs: string[] = [];
  for (let i = 0; i < numLines; i++) {
    if (Math.random() < 0.5) {
      outputs.push(systemMessages[Math.floor(Math.random() * systemMessages.length)]);
    } else {
      outputs.push(progressIndicators[Math.floor(Math.random() * progressIndicators.length)]);
    }
  }
  
  return outputs;
}; 