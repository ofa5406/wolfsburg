<#
  rhino.ps1 — convenience wrapper around rhino_client.py for PowerShell.

  Lets you talk to a running Rhino without typing "python ...".
  Run it from anywhere; it always finds rhino_client.py next to itself.

  Examples:
      .\rhino.ps1 ping
      .\rhino.ps1 summary
      .\rhino.ps1 objects --layer "Layer 01"
      .\rhino.ps1 info --name "MyBox"
      .\rhino.ps1 send get_document_summary

  Prerequisite: Rhino 8 open, with `mcpstart` typed into its command line.
#>

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$client = Join-Path $scriptDir "rhino_client.py"

# Prefer 'python', fall back to 'py' launcher.
$py = (Get-Command python -ErrorAction SilentlyContinue)
if ($null -eq $py) { $py = (Get-Command py -ErrorAction SilentlyContinue) }
if ($null -eq $py) {
    Write-Error "Python was not found on PATH. Install Python or add it to PATH."
    exit 1
}

& $py.Source $client @args
exit $LASTEXITCODE
