# Alarm One landing site

Static website for Alarm One, an iPhone alarm app for rotating shift schedules, alarms on specific dates and alarms in other time zones.

- Live site: https://alarmone.echopie.com/
- App Store: https://apps.apple.com/app/id6748434148
- Alarm One is an Echopie app: https://echopie.com/

## Checks

Run before opening a pull request:

```sh
python3 scripts/build_site.py --check   # homepage guide links and sitemap.xml are up to date
python3 scripts/check_seo.py            # metadata, links, JSON-LD and footer checks
node scripts/check_rotation.mjs         # rotation preview examples
```

## Deploys

Cloudflare Workers Builds runs `npx wrangler deploy` on `main` and `npx wrangler preview` on other branches, from the repo root with no build command. Wrangler is pinned to `4.156.2` in `package.json` and `package-lock.json`. [Workers Builds automatically installs dependencies](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/#skip-dependency-install), so these commands use the pinned local version. Configuration lives in `wrangler.jsonc`; the empty `previews` block enables branch previews. `.assetsignore` keeps repo tooling out of the public site.
