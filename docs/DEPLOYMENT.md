# Production source and releases

The production branch is `main`. Commit and push reviewed source before deploying.
The active release is `/var/www/hawkeri-current`. Its Git HEAD and `.release.json`
record the deployed commit. Never run `git stash` or rebuild a running release.

Production deployment is explicitly dispatched from GitHub Actions after review.
The legacy workflow targeted obsolete directories/ports; automatic pushes no
longer execute it. `SSH_PRIVATE_KEY` must authenticate to this VPS as root.
Alternatively run on the VPS:

```sh
bash /var/www/hawkeri-current/scripts/deploy-vps.sh FULL_40_CHARACTER_COMMIT_SHA
```

The script accepts only the remote deployment branch tip, builds a new release
using `npm ci`, copies the current private `.env`, starts on a free loopback port,
checks HTTP, switches Nginx and updates the release pointer. Failure after the
switch restores the previous Nginx upstream and pointer. Previous releases and
processes are retained for rollback; stop obsolete processes after browser checks.
A shared server lock serializes frontend deployments.

Credentials, `.env`, generated bundles, caches and local graph outputs are private
or derived state and are not source parity targets. Do not commit them. Use the
committed dependency lockfile for repeatable installations. The website's live
API/database is not copied into GitHub.
