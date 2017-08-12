const url = require('url')
const R = require('ramda')
const { TRACKERS } = require('./constants')

const matchTracker = R.cond([
  [ // parse rutracker
    (v) => [
      'rutracker.org', 'rutracker.net', 'maintracker.org'
    ].includes(v),
    R.always(TRACKERS.RUTRACKER)
  ],
  [
    R.T, R.always(TRACKERS.UNKNOWN)
  ]
])

const parseId = {
  [ TRACKERS.UNKNOWN ]: R.always(null),
  [ TRACKERS.RUTRACKER ]: R.path([ 'query', 't' ])
}

function detectTracker (link) {
  const parsed = url.parse(link, true)
  const tracker = matchTracker(parsed.hostname)
  const torrent = parseId[tracker](parsed)

  return { tracker, torrent }
}

module.exports = { detectTracker }