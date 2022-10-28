# Development workflow

This is the proposed dev workflow:

- Create a feature branch
- Push changes to your branch
- Add a changeset (if the changes should result in a new version)

```bash
pnpm changeset
```

- Create a pull request
- Merge the pull request into the main (default) branch
- If the pull request contained a changeset, the changesets action will create a "Version Packages" pull request
- Continue merging changes into the main (default) branch
- Merge the "Version Packages" pull request to trigger a release

Make sure the CI has a valid automation NPM access token.