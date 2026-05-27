# Phase B token sweep — replace Tailwind utility classes that use raw brand hex
# with semantic tokens added in Phase A.
#
# Reads/writes UTF-8 without BOM via .NET APIs so accented chars don't mojibake
# on Windows PowerShell 5.1 (whose Get-Content defaults to the system codepage).

$ErrorActionPreference = "Stop"

# Pairs of (regex, replacement). Order matters: more-specific patterns first.
# `/(\d+)` captures Tailwind opacity suffixes (e.g. text-[#FF5A36]/40) and
# preserves them ($1). The fixed pattern below must NOT consume the suffix.
$replacements = @(
    # ---------- Brand primary ----------
    @("text-\[#FF5A36\]/(\d+)",   "text-primary/`$1"),
    @("bg-\[#FF5A36\]/(\d+)",     "bg-primary/`$1"),
    @("border-\[#FF5A36\]/(\d+)", "border-primary/`$1"),
    @("text-\[#FF5A36\](?!/)",    "text-primary"),
    @("bg-\[#FF5A36\](?!/)",      "bg-primary"),
    @("border-\[#FF5A36\](?!/)",  "border-primary"),
    @("ring-\[#FF5A36\](?!/)",    "ring-primary"),
    @("fill-\[#FF5A36\](?!/)",    "fill-primary"),
    @("stroke-\[#FF5A36\](?!/)",  "stroke-primary"),

    # Primary darker hover variants — normalize all to one shade
    @("hover:bg-\[#e04e2d\]", "hover:bg-[#E63E1D]"),
    @("hover:bg-\[#E24D2E\]", "hover:bg-[#E63E1D]"),
    @("hover:bg-\[#FF4522\]", "hover:bg-[#E63E1D]"),

    # ---------- Brand tints ----------
    @("bg-\[#FFF5F0\]",     "bg-brand-50"),
    @("bg-\[#FFF1ED\]",     "bg-brand-50"),
    @("bg-\[#FFF8F6\]",     "bg-brand-50/50"),
    @("bg-\[#FFE0D4\]",     "bg-brand-100"),
    @("bg-\[#FFEAE0\]",     "bg-brand-100"),
    @("bg-\[#ffeae0\]",     "bg-brand-100"),
    @("bg-\[#ffe7df\]",     "bg-brand-100"),
    @("bg-\[#fff5f0\]",     "bg-brand-50"),
    @("border-\[#FFD5C8\]", "border-brand-200"),
    @("text-\[#C84426\]",   "text-brand-700"),

    # ---------- Success ----------
    @("text-\[#1D9E75\]/(\d+)",   "text-success-500/`$1"),
    @("bg-\[#1D9E75\]/(\d+)",     "bg-success-500/`$1"),
    @("border-\[#1D9E75\]/(\d+)", "border-success-500/`$1"),
    @("text-\[#1D9E75\](?!/)",    "text-success-500"),
    @("bg-\[#1D9E75\](?!/)",      "bg-success-500"),
    @("border-\[#1D9E75\](?!/)",  "border-success-500"),
    @("bg-\[#178D67\]",           "bg-success-600"),
    @("bg-\[#F0FDF4\]",           "bg-success-50"),
    @("bg-\[#EDFAF5\]",           "bg-success-50"),
    @("border-\[#BBF7D0\]",       "border-success-500/30"),
    @("text-\[#166534\]",         "text-success-600"),
    @("text-\[#1a7a40\]",         "text-success-600"),

    # ---------- Borders ----------
    @("border-\[#E5E7EB\]", "border-border"),
    @("border-\[#E5E5E5\]", "border-border"),
    @("border-\[#E8EAEE\]", "border-border"),
    @("border-\[#DFE3E8\]", "border-border"),
    @("border-\[#d1d5db\]", "border-border"),
    @("border-\[#f0f0f0\]", "border-border/60"),

    # ---------- Neutral backgrounds ----------
    @("bg-\[#F7F7F8\]", "bg-muted"),
    @("bg-\[#FAFAFA\]", "bg-muted/40"),
    @("bg-\[#FBFCFD\]", "bg-muted/40"),
    @("bg-\[#FAFBFD\]", "bg-muted/40"),
    @("bg-\[#F8F9FA\]", "bg-muted"),
    @("bg-\[#F3F4F6\]", "bg-muted"),

    # ---------- Neutral text ----------
    @("text-\[#111827\]",  "text-foreground"),
    @("text-\[#1a1a1a\]",  "text-foreground"),
    @("text-\[#374151\]",  "text-foreground"),
    @("text-\[#4b5563\]",  "text-foreground/80"),
    @("text-\[#4B5563\]",  "text-foreground/80"),
    @("text-\[#6b7280\]",  "text-muted-foreground"),
    @("text-\[#9ca3af\]",  "text-muted-foreground/80"),
    @("text-\[#9CA3AF\]",  "text-muted-foreground/80"),

    # ---------- slate-* utilities ----------
    # Opacity-suffix variants first, then bare. Negative lookahead prevents
    # the bare rule from eating "/<digits>" suffixes.
    @("text-slate-900(?!/)", "text-foreground"),
    @("text-slate-800(?!/)", "text-foreground"),
    @("text-slate-700(?!/)", "text-foreground/90"),
    @("text-slate-600(?!/)", "text-muted-foreground"),
    @("text-slate-500(?!/)", "text-muted-foreground"),
    @("text-slate-400(?!/)", "text-muted-foreground/70"),
    @("text-slate-300(?!/)", "text-muted-foreground/50"),

    @("border-slate-300(?!/)", "border-border"),
    @("border-slate-200(?!/)", "border-border"),
    @("border-slate-100(?!/)", "border-border/60"),

    # IMPORTANT: bg-slate-50 → bg-muted/40 — anchor end-of-class so trailing
    # opacity suffix doesn't double up.
    @("bg-slate-50(?!/)",   "bg-muted/40"),
    @("bg-slate-100(?!/)",  "bg-muted"),
    @("bg-slate-800(?!/)",  "bg-foreground"),

    @("hover:bg-slate-100",      "hover:bg-muted"),
    @("hover:bg-slate-50",       "hover:bg-muted"),
    @("hover:text-slate-700",    "hover:text-foreground"),
    @("hover:border-slate-300",  "hover:border-border"),
    @("hover:border-slate-200",  "hover:border-border")
)

$utf8 = New-Object System.Text.UTF8Encoding($false) # no BOM

$files = Get-ChildItem -Path "D:\printify\components", "D:\printify\app" `
    -Recurse -Include *.tsx,*.ts -File |
    Where-Object { $_.FullName -notlike "*node_modules*" }

$filesChanged = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $utf8)
    $original = $content
    $localCount = 0

    foreach ($pair in $replacements) {
        $pattern = $pair[0]
        $replacement = $pair[1]
        $before = $content
        $content = [regex]::Replace($content, $pattern, $replacement)
        if ($content -ne $before) {
            $matchCount = ([regex]::Matches($before, $pattern)).Count
            $localCount += $matchCount
        }
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8)
        $filesChanged++
        $totalReplacements += $localCount
        Write-Output ("{0,-60} {1,3} replacements" -f $file.FullName.Replace("D:\printify\", ""), $localCount)
    }
}

Write-Output ""
Write-Output ("Done. Files changed: {0}. Replacements: {1}." -f $filesChanged, $totalReplacements)
