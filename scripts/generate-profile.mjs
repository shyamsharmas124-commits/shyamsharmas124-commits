#!/usr/bin/env node
/**
 * scripts/generate-profile.mjs
 * Native Node.js 20 generator for GitHub Profile SVG assets & dynamic README telemetry.
 * Zero external npm dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const USERNAME = 'shyamsharmas124-commits';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

const PINNED_OSS_REPOS = [
  'gprmax/gprmax',
  'unit8co/darts',
  'matrix-org/matrix-js-sdk',
];

const EXCLUDED_ORGS = [
  'shyamsharmas124-commits',
  'kaviumcomunity',
  'kalviumcommunity',
];

const FALLBACK_PRS = [
  {
    repo: 'gprMax/gprMax',
    number: 963,
    title: 'Validate output path safety, transactional writing and origin checks in geometry export',
    url: 'https://github.com/gprMax/gprMax/pull/963',
    mergedAt: '2026-10-14'
  },
  {
    repo: 'gprMax/gprMax',
    number: 958,
    title: 'Validate output path safety, atomic writing and critical-angle guards in AntennaPatterns',
    url: 'https://github.com/gprMax/gprMax/pull/958',
    mergedAt: '2026-10-10'
  },
  {
    repo: 'gprMax/gprMax',
    number: 946,
    title: 'Validate output path safety in head extraction and reject non-finite timewindows',
    url: 'https://github.com/gprMax/gprMax/pull/946',
    mergedAt: '2026-10-04'
  },
  {
    repo: 'gprMax/gprMax',
    number: 945,
    title: 'Validate receiver presence and recording status in plot_Ascan, Marimo and trace tools',
    url: 'https://github.com/gprMax/gprMax/pull/945',
    mergedAt: '2026-10-03'
  },
  {
    repo: 'gprMax/gprMax',
    number: 940,
    title: 'Handle missing nrx attribute and validate grid paths in outputfiles_merge and plot_Bscan',
    url: 'https://github.com/gprMax/gprMax/pull/940',
    mergedAt: '2026-09-29'
  },
  {
    repo: 'unit8co/darts',
    number: 3285,
    title: 'fix: preserve mode in extract_subseries and handle all-NaN series in strip',
    url: 'https://github.com/unit8co/darts/pull/3285',
    mergedAt: '2026-09-28'
  },
  {
    repo: 'gprMax/gprMax',
    number: 931,
    title: 'Handle missing Name and nrx attributes in plotting toolboxes',
    url: 'https://github.com/gprMax/gprMax/pull/931',
    mergedAt: '2026-09-26'
  },
  {
    repo: 'gprMax/gprMax',
    number: 922,
    title: 'Normalize receiver paths and validate grids in matching_receiver_path',
    url: 'https://github.com/gprMax/gprMax/pull/922',
    mergedAt: '2026-09-24'
  },
  {
    repo: 'gprMax/gprMax',
    number: 908,
    title: 'Support gauspulse built-in waveform in ImpulseResponse toolbox',
    url: 'https://github.com/gprMax/gprMax/pull/908',
    mergedAt: '2026-09-19'
  },
  {
    repo: 'unit8co/darts',
    number: 3254,
    title: 'fix: preserve series dtype in reconciliation transformers (#785)',
    url: 'https://github.com/unit8co/darts/pull/3254',
    mergedAt: '2026-09-17'
  },
  {
    repo: 'gprMax/gprMax',
    number: 888,
    title: 'Fix FFT spectrum truncation for impulse and DC-peaked waveforms in plotting toolboxes',
    url: 'https://github.com/gprMax/gprMax/pull/888',
    mergedAt: '2026-09-12'
  },
  {
    repo: 'unit8co/darts',
    number: 3234,
    title: 'docs: clarify correlation handling in multi-step probabilistic forecasts (#2778)',
    url: 'https://github.com/unit8co/darts/pull/3234',
    mergedAt: '2026-09-08'
  },
  {
    repo: 'matrix-org/matrix-js-sdk',
    number: 5604,
    title: 'Stop CapabilityPoller when fetch is in flight and stop RetentionPolicyService on stopClient',
    url: 'https://github.com/matrix-org/matrix-js-sdk/pull/5604',
    mergedAt: '2026-09-05'
  },
  {
    repo: 'gprMax/gprMax',
    number: 876,
    title: 'fix: resolve gathered bscan plotting filename collision',
    url: 'https://github.com/gprMax/gprMax/pull/876',
    mergedAt: '2026-09-02'
  },
  {
    repo: 'gprMax/gprMax',
    number: 869,
    title: 'fix: validate accelerator backend before allocation in htod source and receiver helpers',
    url: 'https://github.com/gprMax/gprMax/pull/869',
    mergedAt: '2026-08-30'
  },
  {
    repo: 'gprMax/gprMax',
    number: 861,
    title: 'feat(typing): resolve circular imports using TYPE_CHECKING and annotations',
    url: 'https://github.com/gprMax/gprMax/pull/861',
    mergedAt: '2026-08-25'
  },
  {
    repo: 'gprMax/gprMax',
    number: 858,
    title: 'fix(pml): validate local PML thickness against MPI subgrid boundaries',
    url: 'https://github.com/gprMax/gprMax/pull/858',
    mergedAt: '2026-08-22'
  },
  {
    repo: 'gprMax/gprMax',
    number: 857,
    title: 'fix(pml): validate slab thickness before MPI grid assignment',
    url: 'https://github.com/gprMax/gprMax/pull/857',
    mergedAt: '2026-08-20'
  }
];

function escapeXml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const reqHeaders = {
  'User-Agent': 'shyam-profile-generator-v2',
  'Accept': 'application/vnd.github.v3+json'
};
if (GITHUB_TOKEN) {
  reqHeaders['Authorization'] = `bearer ${GITHUB_TOKEN}`;
}

/**
 * 1. Fetch Live 26-Week Activity & Streaks
 */
async function fetchActivityAndStreaks() {
  console.log('Fetching contribution calendar & streak statistics...');
  if (GITHUB_TOKEN) {
    try {
      const gqlQuery = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    weekday
                  }
                }
              }
            }
          }
        }
      `;
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': reqHeaders['User-Agent']
        },
        body: JSON.stringify({ query: gqlQuery, variables: { login: USERNAME } })
      });
      if (res.ok) {
        const body = await res.json();
        const cal = body?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal && Array.isArray(cal.weeks) && cal.weeks.length > 0) {
          return processContributionCalendar(cal.weeks, cal.totalContributions);
        }
      }
    } catch (err) {
      console.warn('GraphQL API query failed, falling back to public endpoint:', err.message);
    }
  }

  // Fallback 1: jogruber public API
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, {
      headers: { 'User-Agent': reqHeaders['User-Agent'] }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
        return processFlatContributions(data.contributions, data.total?.lastYear || 347);
      }
    }
  } catch (err) {
    console.warn('Contributions public fallback failed:', err.message);
  }

  // Fallback 2: Synthetic static 26-week calendar
  console.log('Using static fallback calendar');
  return generateStaticCalendar();
}

function processContributionCalendar(weeks, totalContributions) {
  // Extract all days in chronological order
  const allDays = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      allDays.push({
        date: day.date,
        count: day.contributionCount,
        weekday: day.weekday
      });
    }
  }

  const { currentStreak, longestStreak } = calculateStreaks(allDays);
  const last26Weeks = weeks.slice(-26);

  // Normalize each of the 26 weeks to ensure 7 days (fill missing days if needed)
  const normalized26Weeks = normalizeWeeks(last26Weeks);

  return {
    totalContributions: totalContributions || allDays.reduce((acc, d) => acc + d.count, 0),
    currentStreak,
    longestStreak,
    weeks: normalized26Weeks,
    startDate: normalized26Weeks[0]?.[0]?.date || '2026-05-18',
    endDate: normalized26Weeks[normalized26Weeks.length - 1]?.slice(-1)[0]?.date || '2026-11-15'
  };
}

function processFlatContributions(contributions, totalContribs) {
  const allDays = contributions.map(c => ({
    date: c.date,
    count: c.count,
    weekday: new Date(c.date).getUTCDay()
  }));

  const { currentStreak, longestStreak } = calculateStreaks(allDays);

  // Take the last 182 days (26 weeks * 7)
  const recentDays = allDays.slice(-182);
  const weeks = [];
  for (let i = 0; i < recentDays.length; i += 7) {
    weeks.push(recentDays.slice(i, i + 7));
  }
  const normalized26Weeks = normalizeWeeks(weeks);

  return {
    totalContributions: totalContribs || allDays.reduce((acc, d) => acc + d.count, 0),
    currentStreak,
    longestStreak,
    weeks: normalized26Weeks,
    startDate: normalized26Weeks[0]?.[0]?.date || '2026-05-18',
    endDate: normalized26Weeks[normalized26Weeks.length - 1]?.slice(-1)[0]?.date || '2026-11-15'
  };
}

function normalizeWeeks(rawWeeks) {
  // Ensure array of exactly 26 weeks, each with up to 7 day objects
  const weeks = rawWeeks.slice(-26).map(w => {
    const days = Array.isArray(w.contributionDays) ? w.contributionDays : (Array.isArray(w) ? w : []);
    return days.map(d => ({
      date: d.date,
      count: d.contributionCount !== undefined ? d.contributionCount : (d.count || 0)
    }));
  });

  while (weeks.length < 26) {
    const dummyWeek = Array.from({ length: 7 }, () => ({ date: '', count: 0 }));
    weeks.unshift(dummyWeek);
  }
  return weeks;
}

function calculateStreaks(days) {
  let longestStreak = 0;
  let tempStreak = 0;

  for (const day of days) {
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak: ending today or yesterday
  const dayMap = new Map(days.map(d => [d.date, d.count]));
  let currentStreak = 0;
  let check = new Date();
  let checkKey = check.toISOString().split('T')[0];

  // If today has 0, check if yesterday was active
  if ((dayMap.get(checkKey) || 0) === 0) {
    check = new Date(Date.now() - 86400000);
    checkKey = check.toISOString().split('T')[0];
  }

  while ((dayMap.get(checkKey) || 0) > 0) {
    currentStreak++;
    check = new Date(check.getTime() - 86400000);
    checkKey = check.toISOString().split('T')[0];
  }

  return { currentStreak, longestStreak };
}

function generateStaticCalendar() {
  const weeks = [];
  const today = new Date();
  for (let w = 25; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const past = new Date(today.getTime() - ((w * 7) + (6 - d)) * 86400000);
      const isWeekend = d === 0 || d === 6;
      const count = isWeekend ? (Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0) : Math.floor(Math.random() * 6);
      week.push({
        date: past.toISOString().split('T')[0],
        count
      });
    }
    weeks.push(week);
  }

  return {
    totalContributions: 347,
    currentStreak: 2,
    longestStreak: 6,
    weeks,
    startDate: weeks[0][0].date,
    endDate: weeks[25][6].date
  };
}

/**
 * 2. Fetch Repository Language Breakdown
 */
async function fetchLanguageBreakdown() {
  console.log('Fetching language breakdown across non-fork repositories...');
  const fallbackLangs = [
    { name: 'Python', percent: 42, color: '#ff6a1f' },
    { name: 'JavaScript', percent: 31, color: '#f59e0b' },
    { name: 'TypeScript', percent: 14, color: '#38bdf8' },
    { name: 'HTML/CSS', percent: 13, color: '#ec4899' },
  ];

  try {
    const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`, {
      headers: reqHeaders
    });
    if (!reposRes.ok) throw new Error(`Repo fetch HTTP ${reposRes.status}`);
    const repos = await reposRes.json();
    if (!Array.isArray(repos)) throw new Error('Invalid repos response');

    const nonFork = repos.filter(r => !r.fork);
    const totals = {};

    for (const repo of nonFork) {
      if (!repo.languages_url) continue;
      try {
        const langRes = await fetch(repo.languages_url, { headers: reqHeaders });
        if (langRes.ok) {
          const langs = await langRes.json();
          for (const [k, v] of Object.entries(langs)) {
            totals[k] = (totals[k] || 0) + v;
          }
        }
      } catch {
        // continue
      }
    }

    // Merge HTML and CSS into HTML/CSS
    const htmlCss = (totals['HTML'] || 0) + (totals['CSS'] || 0);
    delete totals['HTML'];
    delete totals['CSS'];
    if (htmlCss > 0) {
      totals['HTML/CSS'] = htmlCss;
    }

    // Total byte count
    const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0);
    if (totalBytes === 0) return fallbackLangs;

    // Sort by byte count descending
    const sorted = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const colors = {
      'Python': '#ff6a1f',
      'JavaScript': '#f59e0b',
      'TypeScript': '#38bdf8',
      'HTML/CSS': '#ec4899',
      'C++': '#f43f5e',
      'Java': '#e11d48',
      'Go': '#06b6d4',
      'Rust': '#f97316'
    };

    let remainingPercent = 100;
    const result = sorted.map(([name, bytes], idx) => {
      let percent = Math.round((bytes / totalBytes) * 100);
      if (idx === sorted.length - 1) {
        percent = remainingPercent;
      } else {
        remainingPercent -= percent;
      }
      return {
        name,
        percent: Math.max(1, percent),
        color: colors[name] || '#a855f7'
      };
    });

    return result.length > 0 ? result : fallbackLangs;
  } catch (err) {
    console.warn('Language calculation failed, using fallback:', err.message);
    return fallbackLangs;
  }
}

/**
 * 3. Fetch & Filter Merged Open-Source PRs
 */
async function fetchMergedPRs() {
  console.log('Fetching & filtering merged open-source PRs...');
  try {
    const url = `https://api.github.com/search/issues?q=is:pr+is:merged+author:${USERNAME}&sort=updated&order=desc&per_page=100`;
    const res = await fetch(url, { headers: reqHeaders });
    if (!res.ok) throw new Error(`PR search HTTP ${res.status}`);
    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) throw new Error('No items returned');

    const acceptedPRs = [];
    const repoMetadataCache = new Map();

    for (const item of data.items) {
      const parts = item.repository_url.split('/');
      const owner = parts[parts.length - 2];
      const repo = parts[parts.length - 1];
      const fullName = `${owner}/${repo}`;
      const ownerLower = owner.toLowerCase();
      const fullNameLower = fullName.toLowerCase();

      // Exclude author's own repos & university/coursework repos
      if (
        EXCLUDED_ORGS.includes(ownerLower) ||
        ownerLower.includes('kavium') ||
        ownerLower.includes('kalvium')
      ) {
        continue;
      }

      // Check if pinned
      if (PINNED_OSS_REPOS.includes(fullNameLower)) {
        acceptedPRs.push({
          repo: fullName,
          number: item.number,
          title: item.title,
          url: item.html_url,
          mergedAt: item.closed_at ? item.closed_at.split('T')[0] : ''
        });
        continue;
      }

      // Check external repo star count & non-fork status
      let meta = repoMetadataCache.get(fullNameLower);
      if (!meta) {
        try {
          const rRes = await fetch(item.repository_url, { headers: reqHeaders });
          if (rRes.ok) {
            meta = await rRes.json();
            repoMetadataCache.set(fullNameLower, meta);
          }
        } catch {
          // ignore
        }
      }

      if (meta && !meta.fork && (meta.stargazers_count || 0) >= 25) {
        acceptedPRs.push({
          repo: fullName,
          number: item.number,
          title: item.title,
          url: item.html_url,
          mergedAt: item.closed_at ? item.closed_at.split('T')[0] : ''
        });
      }
    }

    if (acceptedPRs.length > 0) {
      console.log(`Found ${acceptedPRs.length} verified open-source PRs from API`);
      return acceptedPRs;
    }
  } catch (err) {
    console.warn('PR search failed or rate-limited, using fallback data:', err.message);
  }

  console.log(`Using ${FALLBACK_PRS.length} seeded fallback PRs`);
  return FALLBACK_PRS;
}

/**
 * 4. Generate SVG #1: `assets/hero-metro.svg` (900 × 340)
 */
function generateHeroMetroSvg(stats) {
  const { currentStreak, mergedPrs } = stats;
  const mergedCount = mergedPrs.length || 18;
  const catLevel = Math.max(1, Math.floor((currentStreak || 0) / 2) + Math.floor(mergedCount / 3));
  const catMood = currentStreak > 0
    ? `streak: ${currentStreak}d · purring 🐾`
    : `idle · feed me a commit! 😴`;

  // Metro Stop Configurations
  const stops = [
    {
      id: 'newsletter',
      x: 95,
      y: 105,
      title: 'Newsletter SaaS',
      subtitle: 'Multi-Tenant API',
      color: '#f59e0b',
      textAnchor: 'middle',
      labelY: 76,
      subY: 90
    },
    {
      id: 'phonedetector',
      x: 95,
      y: 255,
      title: 'Phone Detector AI',
      subtitle: '~45ms YOLOv8',
      color: '#ff6a1f',
      textAnchor: 'middle',
      labelY: 284,
      subY: 298
    },
    {
      id: 'studenthub',
      x: 395,
      y: 105,
      title: 'StudentHub',
      subtitle: '8-Model EdTech',
      color: '#38bdf8',
      textAnchor: 'middle',
      labelY: 76,
      subY: 90
    },
    {
      id: 'gprmax',
      x: 395,
      y: 255,
      title: 'gprMax',
      subtitle: '14 Merged PRs',
      color: '#ff6a1f',
      textAnchor: 'middle',
      labelY: 284,
      subY: 298
    },
    {
      id: 'darts',
      x: 555,
      y: 135,
      title: 'unit8co/darts',
      subtitle: '3 Merged PRs',
      color: '#10b981',
      textAnchor: 'middle',
      labelY: 110,
      subY: 124
    },
    {
      id: 'matrix',
      x: 555,
      y: 235,
      title: 'matrix-js-sdk',
      subtitle: '1 Merged PR',
      color: '#38bdf8',
      textAnchor: 'middle',
      labelY: 264,
      subY: 278
    }
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="900" height="340" viewBox="0 0 900 340" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap');
      .mono { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace; }
      .bold { font-weight: 700; }
      .extrabold { font-weight: 800; }
    </style>
    <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff8c42" />
      <stop offset="100%" stop-color="#ff4500" />
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f2619" />
      <stop offset="100%" stop-color="#143522" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#19110c" />
      <stop offset="100%" stop-color="#120c08" />
    </linearGradient>
    <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="#2a1d15" opacity="0.6" />
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="900" height="340" rx="14" fill="#0c0705" stroke="#2a1d15" stroke-width="1.5" />
  <rect width="900" height="340" rx="14" fill="url(#gridPattern)" />

  <!-- Outer Header -->
  <g transform="translate(24, 20)">
    <!-- Metro Icon -->
    <rect x="0" y="0" width="22" height="22" rx="5" fill="#1f140e" stroke="#ff6a1f" stroke-width="1.2" />
    <circle cx="11" cy="11" r="5" fill="none" stroke="#ff6a1f" stroke-width="1.5" />
    <path d="M 6 11 L 16 11" stroke="#ff6a1f" stroke-width="1.5" stroke-linecap="round" />

    <!-- Title -->
    <text x="32" y="16" fill="#ffe6c2" font-size="12.5" letter-spacing="1px" class="mono bold">COMMIT METRO · @SHYAMSHARMAS124-COMMITS</text>
    <text x="32" y="28" fill="#8f7868" font-size="9" letter-spacing="0.5px" class="mono">SYSTEM ID: SHYAM-CORE // 4 TRANSIT LINES // HIGH-AVAILABILITY SWE PIPELINE</text>
  </g>

  <!-- Live Status Badge (Top Right) -->
  <g transform="translate(620, 18)">
    <rect width="256" height="28" rx="7" fill="url(#badgeGrad)" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.4" />
    <!-- Pulsing Indicator Dot -->
    <circle cx="16" cy="14" r="4.5" fill="#10b981">
      <animate attributeName="r" values="3.5;5.5;3.5" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="16" cy="14" r="8" fill="none" stroke="#10b981" stroke-width="1.2" opacity="0.5">
      <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
    <text x="30" y="18" fill="#34d399" font-size="10" letter-spacing="0.6px" class="mono bold">● OPEN TO SWE / AI INTERNSHIPS</text>
  </g>

  <!-- Metro Transit Tracks & Circuit -->
  <g id="transit-tracks">
    <!-- JavaScript Line (#f59e0b) -->
    <path d="M 95 105 L 180 105 L 250 175" fill="none" stroke="#f59e0b" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round" />
    <!-- Animated Light Packet JS -->
    <path d="M 95 105 L 180 105 L 250 175" fill="none" stroke="#fde68a" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 160">
      <animate attributeName="stroke-dashoffset" from="174" to="0" dur="2.8s" repeatCount="indefinite" />
    </path>

    <!-- Python Line (#ff6a1f) Left Leg -->
    <path d="M 95 255 L 180 255 L 250 175" fill="none" stroke="#ff6a1f" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round" />
    <!-- Animated Light Packet Python Left -->
    <path d="M 95 255 L 180 255 L 250 175" fill="none" stroke="#ffedd5" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 160">
      <animate attributeName="stroke-dashoffset" from="174" to="0" dur="3.2s" repeatCount="indefinite" />
    </path>

    <!-- TypeScript Line (#38bdf8) -->
    <path d="M 250 175 L 320 105 L 395 105" fill="none" stroke="#38bdf8" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round" />
    <!-- Animated Light Packet TS -->
    <path d="M 250 175 L 320 105 L 395 105" fill="none" stroke="#bae6fd" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 160">
      <animate attributeName="stroke-dashoffset" from="0" to="174" dur="2.6s" repeatCount="indefinite" />
    </path>

    <!-- Python / OSS Line (#ff6a1f) Right Leg -->
    <path d="M 250 175 L 320 255 L 395 255" fill="none" stroke="#ff6a1f" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round" />
    <!-- Animated Light Packet Python Right -->
    <path d="M 250 175 L 320 255 L 395 255" fill="none" stroke="#fed7aa" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 160">
      <animate attributeName="stroke-dashoffset" from="0" to="174" dur="3s" repeatCount="indefinite" />
    </path>

    <!-- Systems / OSS Line (#10b981) from StudentHub to Darts -->
    <path d="M 395 105 L 475 135 L 555 135" fill="none" stroke="#10b981" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round" />
    <!-- Animated Light Packet Systems -->
    <path d="M 395 105 L 475 135 L 555 135" fill="none" stroke="#a7f3d0" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 180">
      <animate attributeName="stroke-dashoffset" from="0" to="194" dur="2.9s" repeatCount="indefinite" />
    </path>

    <!-- Systems / OSS Cross-Connector between Darts and Matrix -->
    <path d="M 555 135 L 555 235" fill="none" stroke="#10b981" stroke-width="2.5" stroke-opacity="0.25" stroke-dasharray="4 4" />

    <!-- Systems / OSS Line from gprMax to Matrix -->
    <path d="M 395 255 L 475 235 L 555 235" fill="none" stroke="#38bdf8" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round" />
    <!-- Animated Light Packet Matrix -->
    <path d="M 395 255 L 475 235 L 555 235" fill="none" stroke="#bae6fd" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 180">
      <animate attributeName="stroke-dashoffset" from="0" to="194" dur="3.4s" repeatCount="indefinite" />
    </path>
  </g>

  <!-- Central Glowing Hub Node: @shyamsharmas124-commits (250, 175) -->
  <g id="central-hub" transform="translate(250, 175)">
    <!-- Expanding Concentric Pulse Rings -->
    <circle cx="0" cy="0" r="14" fill="none" stroke="#ff6a1f" stroke-width="1.8">
      <animate attributeName="r" values="12;28;12" dur="3s" repeatCount="indefinite" />
      <animate attributeName="stroke-opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="0" cy="0" r="20" fill="none" stroke="#ff6a1f" stroke-width="1.2">
      <animate attributeName="r" values="18;36;18" dur="3s" begin="0.8s" repeatCount="indefinite" />
      <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="3s" begin="0.8s" repeatCount="indefinite" />
    </circle>

    <!-- Hub Solid Disc -->
    <circle cx="0" cy="0" r="12" fill="url(#hubGrad)" stroke="#ffe6c2" stroke-width="2" />
    <circle cx="0" cy="0" r="4.5" fill="#0c0705" />

    <!-- Hub Central Tag Label -->
    <g transform="translate(-86, -34)">
      <rect width="172" height="20" rx="5" fill="#1a110b" stroke="#ff6a1f" stroke-width="1" />
      <text x="86" y="14" text-anchor="middle" fill="#ffe6c2" font-size="10" class="mono bold">HUB: @shyamsharmas124-commits</text>
    </g>
  </g>

  <!-- 6 Metro Station Stops -->
  <g id="station-stops">
    ${stops.map(s => `
    <g transform="translate(${s.x}, ${s.y})">
      <!-- Pulsing Stop Ring -->
      <circle cx="0" cy="0" r="7" fill="none" stroke="${s.color}" stroke-width="1.5">
        <animate attributeName="r" values="5;9.5;5" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <!-- Station Node Circle -->
      <circle cx="0" cy="0" r="5.5" fill="#16100c" stroke="${s.color}" stroke-width="2.5" />
      <circle cx="0" cy="0" r="2" fill="#ffe6c2" />
      <!-- Labels -->
      <text x="0" y="${s.labelY - s.y}" text-anchor="${s.textAnchor}" fill="#ffe6c2" font-size="10.5" class="mono bold">${escapeXml(s.title)}</text>
      <text x="0" y="${s.subY - s.y}" text-anchor="${s.textAnchor}" fill="#9b8577" font-size="8.5" class="mono">${escapeXml(s.subtitle)}</text>
    </g>
    `).join('')}
  </g>

  <!-- Transit Map Legend (Bottom Left) -->
  <g transform="translate(28, 316)">
    <circle cx="0" cy="0" r="4" fill="#ff6a1f" />
    <text x="8" y="3.5" fill="#9b8577" font-size="9" class="mono bold">Python</text>

    <circle cx="65" cy="0" r="4" fill="#f59e0b" />
    <text x="73" y="3.5" fill="#9b8577" font-size="9" class="mono bold">JavaScript</text>

    <circle cx="150" cy="0" r="4" fill="#38bdf8" />
    <text x="158" y="3.5" fill="#9b8577" font-size="9" class="mono bold">TypeScript</text>

    <circle cx="240" cy="0" r="4" fill="#10b981" />
    <text x="248" y="3.5" fill="#9b8577" font-size="9" class="mono bold">Systems/OSS</text>
  </g>

  <!-- Embedded Animated Ember Code Cat Card (Bottom-Right, 665 × 65, 215 × 255) -->
  <g transform="translate(665, 62)">
    <!-- Terminal Outer Card -->
    <rect width="215" height="258" rx="11" fill="url(#cardGrad)" stroke="#2a1d15" stroke-width="1.5" />

    <!-- Terminal Top Header Bar -->
    <g transform="translate(12, 14)">
      <circle cx="0" cy="0" r="3.5" fill="#ef4444" />
      <circle cx="10" cy="0" r="3.5" fill="#eab308" />
      <circle cx="20" cy="0" r="3.5" fill="#10b981" />
      <text x="32" y="3.5" fill="#ff6a1f" font-size="10" class="mono bold">CODE PET · LVL ${catLevel}</text>
    </g>
    <line x1="0" y1="26" x2="215" y2="26" stroke="#2a1d15" stroke-width="1" />

    <!-- Geometric Animated Ember Cat -->
    <g transform="translate(107, 122)">
      <!-- Whole Cat Breathing Bounce Transform -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3.5; 0,0" dur="2.8s" repeatCount="indefinite" />

        <!-- Swaying Curved Tail -->
        <g transform="translate(24, 22)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-12; 22; -12" dur="2.4s" repeatCount="indefinite" />
            <path d="M 0 0 C 14 -10 24 -4 20 -22 C 18 -28 12 -28 9 -22" fill="none" stroke="#ff6a1f" stroke-width="4.5" stroke-linecap="round" />
            <!-- Tail Tip Accent -->
            <circle cx="16" cy="-24" r="3" fill="#ffe6c2" />
          </g>
        </g>

        <!-- Cat Body (Obsidian Ember) -->
        <ellipse cx="0" cy="18" rx="28" ry="21" fill="#ff6a1f" />
        <ellipse cx="0" cy="20" rx="19" ry="14" fill="#e0530e" />
        <ellipse cx="0" cy="22" rx="13" ry="9" fill="#ffa875" fill-opacity="0.3" />

        <!-- Paws -->
        <ellipse cx="-12" cy="36" rx="7" ry="5" fill="#ff6a1f" />
        <ellipse cx="12" cy="36" rx="7" ry="5" fill="#ff6a1f" />
        <ellipse cx="-12" cy="37" rx="3.5" ry="2" fill="#ffe6c2" />
        <ellipse cx="12" cy="37" rx="3.5" ry="2" fill="#ffe6c2" />

        <!-- Cat Head -->
        <circle cx="0" cy="-6" r="21" fill="#ff6a1f" />

        <!-- Ears -->
        <polygon points="-19,-14 -13,-34 -4,-18" fill="#ff6a1f" />
        <polygon points="-16,-15 -13,-29 -7,-18" fill="#ffa875" />
        <polygon points="4,-18 13,-34 19,-14" fill="#ff6a1f" />
        <polygon points="7,-18 13,-29 16,-15" fill="#ffa875" />

        <!-- Face / Eyes with Blinking Animation -->
        <g transform="translate(-8, -8)">
          <ellipse cx="0" cy="0" rx="3.5" ry="4" fill="#0c0705" />
          <ellipse cx="0" cy="0" rx="3.5" ry="4" fill="#ffe6c2">
            <animate attributeName="ry" values="4;4;0.4;4;4" keyTimes="0;0.92;0.95;0.98;1" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="0.8" cy="-1.2" r="1.2" fill="#0c0705" />
        </g>
        <g transform="translate(8, -8)">
          <ellipse cx="0" cy="0" rx="3.5" ry="4" fill="#0c0705" />
          <ellipse cx="0" cy="0" rx="3.5" ry="4" fill="#ffe6c2">
            <animate attributeName="ry" values="4;4;0.4;4;4" keyTimes="0;0.92;0.95;0.98;1" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="-0.8" cy="-1.2" r="1.2" fill="#0c0705" />
        </g>

        <!-- Ember Cheeks -->
        <circle cx="-13" cy="1" r="3.5" fill="#ff3d00" fill-opacity="0.45" />
        <circle cx="13" cy="1" r="3.5" fill="#ff3d00" fill-opacity="0.45" />

        <!-- Snout & Mouth -->
        <polygon points="0,0 -2.5,-2.5 2.5,-2.5" fill="#ffe6c2" />
        <path d="M -3.5 2 Q -1 4.5 0 2 Q 1 4.5 3.5 2" fill="none" stroke="#ffe6c2" stroke-width="1.2" stroke-linecap="round" />

        <!-- Whiskers -->
        <line x1="-12" y1="-2" x2="-23" y2="-5" stroke="#ffe6c2" stroke-width="1" stroke-opacity="0.8" />
        <line x1="-12" y1="2" x2="-23" y2="4" stroke="#ffe6c2" stroke-width="1" stroke-opacity="0.8" />
        <line x1="12" y1="-2" x2="23" y2="-5" stroke="#ffe6c2" stroke-width="1" stroke-opacity="0.8" />
        <line x1="12" y1="2" x2="23" y2="4" stroke="#ffe6c2" stroke-width="1" stroke-opacity="0.8" />
      </g>
    </g>

    <!-- Streak Mood Terminal Panel Below Cat -->
    <g transform="translate(10, 195)">
      <rect width="195" height="50" rx="8" fill="#100a06" stroke="#2a1d15" stroke-width="1" />
      <text x="97.5" y="21" text-anchor="middle" fill="#ffe6c2" font-size="10" class="mono bold">${escapeXml(catMood)}</text>
      <text x="97.5" y="38" text-anchor="middle" fill="#ff6a1f" font-size="8.5" letter-spacing="0.8px" class="mono">STATUS: EMBER ACTIVE</text>
    </g>
  </g>
</svg>
`;
}

/**
 * 5. Generate SVG #2: `assets/telemetry-card.svg` (900 × 250)
 */
function generateTelemetryCardSvg(stats) {
  const { currentStreak, longestStreak, totalContributions, weeks, languages, mergedPrs, startDate, endDate } = stats;
  const mergedCount = mergedPrs.length || 18;

  // 5-step ember color scale
  const emberScale = ['#1c1410', '#5c280e', '#9e4214', '#d95818', '#ff6a1f'];
  function getEmberColor(count) {
    if (!count || count <= 0) return emberScale[0];
    if (count <= 2) return emberScale[1];
    if (count <= 5) return emberScale[2];
    if (count <= 8) return emberScale[3];
    return emberScale[4];
  }

  // Left Panel Languages Stacked Bar Calculation
  const barTotalWidth = 290;
  let accumX = 24;
  const barSegments = languages.map(lang => {
    const segW = Math.max(4, Math.round((lang.percent / 100) * barTotalWidth));
    const item = {
      ...lang,
      x: accumX,
      w: segW
    };
    accumX += segW;
    return item;
  });

  // 26 Weeks Contribution Grid
  const gridStartX = 390;
  const gridStartY = 54;
  const step = 13.5;
  const cellSize = 10.5;

  let gridCellsXml = '';
  weeks.slice(0, 26).forEach((week, colIdx) => {
    week.forEach((day, rowIdx) => {
      const cx = gridStartX + colIdx * step;
      const cy = gridStartY + rowIdx * step;
      const color = getEmberColor(day.count);
      gridCellsXml += `<rect x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${color}" />\n`;
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="900" height="250" viewBox="0 0 900 250" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&amp;display=swap');
      .mono { font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace; }
      .bold { font-weight: 700; }
      .extrabold { font-weight: 800; }
    </style>
    <clipPath id="barClip">
      <rect x="24" y="52" width="${barTotalWidth}" height="14" rx="7" />
    </clipPath>
  </defs>

  <!-- Card Background -->
  <rect width="900" height="250" rx="14" fill="#0c0705" stroke="#2a1d15" stroke-width="1.5" />

  <!-- Divider Line Between Left & Right Panels -->
  <line x1="345" y1="20" x2="345" y2="230" stroke="#2a1d15" stroke-width="1.2" />

  <!-- ================= LEFT PANEL: LANGUAGE SPECTRUM ================= -->
  <g id="left-panel">
    <text x="24" y="36" fill="#ffe6c2" font-size="12" letter-spacing="1px" class="mono bold">LANGUAGE SPECTRUM</text>
    <text x="314" y="36" text-anchor="end" fill="#ff6a1f" font-size="9.5" class="mono bold">CORE STACK</text>

    <!-- Stacked Animated Bar -->
    <rect x="24" y="52" width="${barTotalWidth}" height="14" rx="7" fill="#1c1410" />
    <g clip-path="url(#barClip)">
      ${barSegments.map(s => `
      <rect x="${s.x}" y="52" width="${s.w}" height="14" fill="${s.color}">
        <animate attributeName="width" from="0" to="${s.w}" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
      </rect>
      `).join('')}
    </g>

    <!-- Language Legend Rows -->
    <g transform="translate(24, 88)">
      ${languages.map((l, i) => {
        const y = i * 28;
        const meterW = Math.max(4, Math.round(54 * (l.percent / 100)));
        return `
        <g transform="translate(0, ${y})">
          <circle cx="6" cy="0" r="4.5" fill="${l.color}" />
          <text x="18" y="3.5" fill="#ffe6c2" font-size="11" class="mono bold">${escapeXml(l.name)}</text>
          <text x="220" y="3.5" text-anchor="end" fill="#ffe6c2" font-size="11" class="mono bold">${l.percent}%</text>
          <!-- Mini meter -->
          <rect x="236" y="-3" width="54" height="6" rx="3" fill="#1c1410" />
          <rect x="236" y="-3" width="${meterW}" height="6" rx="3" fill="${l.color}" />
        </g>
        `;
      }).join('')}
    </g>

    <!-- Left Panel Footer -->
    <text x="24" y="218" fill="#786050" font-size="9" class="mono">SYS_CORE // NON-FORK PRODUCTION REPOS</text>
  </g>

  <!-- ================= RIGHT PANEL: ACTIVITY LOG · 26 WEEKS ================= -->
  <g id="right-panel">
    <text x="365" y="36" fill="#ffe6c2" font-size="12" letter-spacing="1px" class="mono bold">ACTIVITY LOG · 26 WEEKS</text>
    <text x="876" y="36" text-anchor="end" fill="#8f7868" font-size="9.5" class="mono">${escapeXml(startDate)} — ${escapeXml(endDate)}</text>

    <!-- Weekday Markers -->
    <text x="372" y="78" fill="#786050" font-size="8.5" class="mono bold">M</text>
    <text x="372" y="105" fill="#786050" font-size="8.5" class="mono bold">W</text>
    <text x="372" y="132" fill="#786050" font-size="8.5" class="mono bold">F</text>

    <!-- 26x7 Contribution Matrix -->
    <g id="contribution-grid">
      ${gridCellsXml}
    </g>

    <!-- Grid Legend (Right of Matrix) -->
    <g transform="translate(755, 96)">
      <text x="0" y="9" fill="#786050" font-size="8.5" class="mono">Less</text>
      <rect x="28" y="0" width="8.5" height="8.5" rx="2" fill="${emberScale[0]}" />
      <rect x="40" y="0" width="8.5" height="8.5" rx="2" fill="${emberScale[1]}" />
      <rect x="52" y="0" width="8.5" height="8.5" rx="2" fill="${emberScale[2]}" />
      <rect x="64" y="0" width="8.5" height="8.5" rx="2" fill="${emberScale[3]}" />
      <rect x="76" y="0" width="8.5" height="8.5" rx="2" fill="${emberScale[4]}" />
      <text x="92" y="9" fill="#786050" font-size="8.5" class="mono">More</text>
    </g>

    <!-- 4 Bottom KPI Blocks -->
    <g id="kpi-blocks" transform="translate(365, 166)">
      <!-- KPI 1: Current Streak -->
      <g transform="translate(0, 0)">
        <rect width="121" height="60" rx="8" fill="#16100c" stroke="#2a1d15" stroke-width="1" />
        <rect width="121" height="2.5" rx="1" fill="#ff6a1f" />
        <text x="12" y="22" fill="#8f7868" font-size="8.5" letter-spacing="0.5px" class="mono bold">CURRENT STREAK</text>
        <text x="12" y="46" fill="#ffe6c2" font-size="16" class="mono extrabold">${currentStreak} <tspan font-size="10" fill="#ff6a1f">DAYS</tspan></text>
      </g>

      <!-- KPI 2: Longest Streak -->
      <g transform="translate(130, 0)">
        <rect width="121" height="60" rx="8" fill="#16100c" stroke="#2a1d15" stroke-width="1" />
        <rect width="121" height="2.5" rx="1" fill="#f59e0b" />
        <text x="12" y="22" fill="#8f7868" font-size="8.5" letter-spacing="0.5px" class="mono bold">LONGEST STREAK</text>
        <text x="12" y="46" fill="#ffe6c2" font-size="16" class="mono extrabold">${longestStreak} <tspan font-size="10" fill="#f59e0b">DAYS</tspan></text>
      </g>

      <!-- KPI 3: Yearly Commits -->
      <g transform="translate(260, 0)">
        <rect width="121" height="60" rx="8" fill="#16100c" stroke="#2a1d15" stroke-width="1" />
        <rect width="121" height="2.5" rx="1" fill="#38bdf8" />
        <text x="12" y="22" fill="#8f7868" font-size="8.5" letter-spacing="0.5px" class="mono bold">YEARLY COMMITS</text>
        <text x="12" y="46" fill="#ffe6c2" font-size="16" class="mono extrabold">${totalContributions}</text>
      </g>

      <!-- KPI 4: OSS Merged PRs -->
      <g transform="translate(390, 0)">
        <rect width="121" height="60" rx="8" fill="#16100c" stroke="#2a1d15" stroke-width="1" />
        <rect width="121" height="2.5" rx="1" fill="#10b981" />
        <text x="12" y="22" fill="#8f7868" font-size="8.5" letter-spacing="0.5px" class="mono bold">OSS MERGED PRS</text>
        <text x="12" y="46" fill="#ffe6c2" font-size="16" class="mono extrabold">${mergedCount} <tspan font-size="10" fill="#10b981">PRS</tspan></text>
      </g>
    </g>
  </g>
</svg>
`;
}

/**
 * 6. Generate Markdown Open-Source Table
 */
function generateOssTable(prs) {
  let table = '| Repository | Pull Request | Scope / Impact | Status |\n';
  table += '|:---|:---|:---|:---:|\n';

  for (const pr of prs) {
    const cleanTitle = pr.title.replace(/\|/g, '\\|');
    table += `| [\`${pr.repo}\`](https://github.com/${pr.repo}) | [#${pr.number}](${pr.url}) | ${cleanTitle} | \`MERGED\` |\n`;
  }

  return table.trim();
}

/**
 * 7. Update README.md between <!-- OSS_START --> and <!-- OSS_END -->
 */
function updateReadmeOssSection(readmePath, prs) {
  if (!fs.existsSync(readmePath)) {
    console.warn(`README not found at ${readmePath}`);
    return;
  }

  const content = fs.readFileSync(readmePath, 'utf8');
  const startTag = '<!-- OSS_START -->';
  const endTag = '<!-- OSS_END -->';

  const sIdx = content.indexOf(startTag);
  const eIdx = content.indexOf(endTag);

  if (sIdx === -1 || eIdx === -1) {
    console.warn('OSS markers not found in README.md; skipping table injection.');
    return;
  }

  const tableMd = generateOssTable(prs);
  const updated = content.slice(0, sIdx + startTag.length) +
    '\n' + tableMd + '\n' +
    content.slice(eIdx);

  fs.writeFileSync(readmePath, updated, 'utf8');
  console.log(`Updated README.md OSS section (${prs.length} PRs)`);
}

/**
 * Main Execution Loop
 */
async function main() {
  console.log('=== Starting Profile Telemetry & Metro Generation ===');

  const [activity, languages, mergedPrs] = await Promise.all([
    fetchActivityAndStreaks(),
    fetchLanguageBreakdown(),
    fetchMergedPRs()
  ]);

  const stats = {
    ...activity,
    languages,
    mergedPrs
  };

  console.log('Statistics Summary:');
  console.log(`- Current Streak: ${stats.currentStreak} days`);
  console.log(`- Longest Streak: ${stats.longestStreak} days`);
  console.log(`- Yearly Contributions: ${stats.totalContributions}`);
  console.log(`- Merged OSS PRs: ${stats.mergedPrs.length}`);
  console.log(`- Top Languages:`, stats.languages.map(l => `${l.name} (${l.percent}%)`).join(', '));

  // Generate SVGs
  const heroMetroSvg = generateHeroMetroSvg(stats);
  const telemetryCardSvg = generateTelemetryCardSvg(stats);

  const assetsDir = path.join(ROOT_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const heroPath = path.join(assetsDir, 'hero-metro.svg');
  const telemetryPath = path.join(assetsDir, 'telemetry-card.svg');

  fs.writeFileSync(heroPath, heroMetroSvg, 'utf8');
  console.log(`Wrote ${heroPath} (${heroMetroSvg.length} bytes)`);

  fs.writeFileSync(telemetryPath, telemetryCardSvg, 'utf8');
  console.log(`Wrote ${telemetryPath} (${telemetryCardSvg.length} bytes)`);

  // Update README.md
  const readmePath = path.join(ROOT_DIR, 'README.md');
  updateReadmeOssSection(readmePath, stats.mergedPrs);

  console.log('=== Profile Generation Completed Successfully ===');
}

main().catch(err => {
  console.error('Fatal generator error:', err);
  process.exit(1);
});
