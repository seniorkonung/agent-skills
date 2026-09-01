# Review Target Identity and Transient Snapshots

Read this reference when the review target includes uncommitted work.

## Stable Target ID

Use a task ID when it uniquely names the reviewed decision boundary. Otherwise
assign a short neutral increment label. Keep the same ID across remediation and
re-audits of that boundary; assign a new ID when the intent or reviewed scope
materially changes.

For an immutable target, record full base and reviewed commit SHAs plus the exact
included paths. Branch names and abbreviated SHAs are not immutable identities.

## Canonical Transient Snapshot

Create a byte-stable patch in scratch space outside the repository with a
temporary Git index seeded from the full base SHA. This captures staged,
unstaged, deleted, and non-ignored untracked files without changing the user's
real index:

```sh
review_snapshot_dir="$(mktemp -d)"
review_index="$review_snapshot_dir/index"
GIT_INDEX_FILE="$review_index" git read-tree "<full-base-sha>"
GIT_INDEX_FILE="$review_index" git add -A -- <explicit-included-paths>
GIT_INDEX_FILE="$review_index" git diff --cached --binary --full-index \
  --no-ext-diff "<full-base-sha>" -- <explicit-included-paths> \
  > "$review_snapshot_dir/target.patch"
sha256sum "$review_snapshot_dir/target.patch"
```

Use explicit pathspecs rather than unresolved globs. Record the base SHA, paths,
exact command variant, and patch SHA-256; give the reviewer the saved patch and
mark the target **provisional**. A digest identifies the reviewed bytes but does
not reconstruct them after the scratch patch is removed.

If the environment lacks an equivalent temporary-index or SHA-256 command, or
intentionally included ignored untracked files cannot be captured, stop as
incomplete instead of claiming a deterministic snapshot. Do not allow edits to
included paths until the reviewer finishes. Then remove the scratch snapshot.

A provisional review may retain substantive findings, but it cannot issue `No
substantive findings`, clear an earlier finding, or replace an immutable-target
review. Commit the intended target and re-audit before treating absence of
findings as durable evidence.
