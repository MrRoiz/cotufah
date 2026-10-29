/**
 * Releases only bump `package.json` and tag the commit: no npm publish, no
 * GitHub release. CI runs this on every push to master, and the `[skip ci]`
 * release commit keeps the loop closed.
 */
export default {
	repositoryUrl: process.env.GITHUB_REPOSITORY
		? `https://github.com/${process.env.GITHUB_REPOSITORY}.git`
		: undefined,
	branches: ["master"],
	plugins: [
		"@semantic-release/commit-analyzer",
		["@semantic-release/npm", { npmPublish: false }],
		[
			"@semantic-release/git",
			{
				assets: ["package.json"],
				message: "chore(release): ${nextRelease.version} [skip ci]",
			},
		],
	],
};
