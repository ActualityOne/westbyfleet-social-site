// Shared Supabase helper for the public "What's On" list and the /admin/ diary.
// Requires supabase-config.js and the Supabase JS UMD build to be loaded first.

function wbscGetClient() {
  var cfg = window.SUPABASE_CONFIG || {};
  if (!cfg.url || !cfg.anonKey) return null;
  if (!window.supabase) return null;
  if (!window._wbscClient) {
    window._wbscClient = window.supabase.createClient(cfg.url, cfg.anonKey);
  }
  return window._wbscClient;
}

async function wbscFetchUpcomingEvents(limit) {
  var client = wbscGetClient();
  if (!client) return [];
  var today = new Date().toISOString().slice(0, 10);
  var query = client
    .from('events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true });
  if (limit) query = query.limit(limit);
  var res = await query;
  if (res.error) {
    console.error('Could not load events:', res.error.message);
    return [];
  }
  return res.data || [];
}

function wbscFormatEventDate(dateStr, timeStr) {
  var d = new Date(dateStr + 'T00:00:00');
  var dateLabel = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  if (timeStr) {
    var parts = timeStr.split(':');
    dateLabel += ', ' + parts[0] + ':' + parts[1];
  }
  return dateLabel;
}

var WBSC_CATEGORY_LABELS = {
  'bingo': 'Bingo',
  'quiz': 'Quiz Night',
  'live-music': 'Live Music',
  'karaoke': 'Karaoke',
  'special-night': 'Special Night',
  'other': 'Event'
};
