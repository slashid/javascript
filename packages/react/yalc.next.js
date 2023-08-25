import { inc } from 'semver'
import pkg from './package.json' assert { type: "json" }
import { writeFileSync } from 'fs'

const version = inc(pkg.version, "prerelease", "next")

writeFileSync("package.json", JSON.stringify({ ...pkg, version }, null, 2))
