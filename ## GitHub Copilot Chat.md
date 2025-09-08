## GitHub Copilot Chat

- Extension Version: 0.30.3 (prod)
- VS Code: vscode/1.103.2
- OS: Windows

## Network

User Settings:

```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:

- DNS ipv4 Lookup: 140.82.114.5 (2 ms)
- DNS ipv6 Lookup: Error (2 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (1 ms)
- Electron fetch (configured): HTTP 200 (49 ms)
- Node.js https: HTTP 200 (161 ms)
- Node.js fetch: HTTP 200 (161 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:

- DNS ipv4 Lookup: 140.82.114.22 (1 ms)
- DNS ipv6 Lookup: Error (2 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (8 ms)
- Electron fetch (configured): HTTP 200 (53 ms)
- Node.js https: HTTP 200 (154 ms)
- Node.js fetch: HTTP 200 (162 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
