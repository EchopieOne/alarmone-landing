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

The site deploys automatically when changes are merged to `main`.
