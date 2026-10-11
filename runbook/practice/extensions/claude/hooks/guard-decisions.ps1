# Claude Code PreToolUse hook (course kit learning helper).
# Asks the human before the engine edits any sibling repo's docs/decisions.md.
# Steering files ask the engine not to change recorded rules. This hook makes the tool
# stop and ask a person. It returns "ask", never "deny": appending a new decision at
# close-out (runbook step 10) is legitimate, and a human approves it in the prompt.
$ErrorActionPreference = 'Stop'
try {
  $payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
  $path = [string]$payload.tool_input.file_path
} catch { exit 0 }

if ($path -match 'prior-auth-[a-z]+[\\/]+docs[\\/]+decisions\.md$') {
  $reason = "This edits a recorded decision log ($path). Recorded rules (D-ids) change " +
            "only with a human decision and sign-off. Approve only if you are appending " +
            "a decision a human made, such as the step-10 copy-over; never to change an " +
            "existing rule."
  @{
    hookSpecificOutput = @{
      hookEventName            = 'PreToolUse'
      permissionDecision       = 'ask'
      permissionDecisionReason = $reason
    }
  } | ConvertTo-Json -Depth 4 -Compress
}
exit 0
