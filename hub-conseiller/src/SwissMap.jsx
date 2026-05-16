import React, { useEffect, useState } from 'react';
import * as topojson from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

// Coordonnées approximatives de Chardonne
const CHARDONNE_COORDS = [6.8189, 46.4823];

// Mapping FSO canton id → code + nom complet
const CANTONS = {
  1: { code: 'ZH', name: 'Zurich' },
  2: { code: 'BE', name: 'Berne' },
  3: { code: 'LU', name: 'Lucerne' },
  4: { code: 'UR', name: 'Uri' },
  5: { code: 'SZ', name: 'Schwyz' },
  6: { code: 'OW', name: 'Obwald' },
  7: { code: 'NW', name: 'Nidwald' },
  8: { code: 'GL', name: 'Glaris' },
  9: { code: 'ZG', name: 'Zoug' },
  10: { code: 'FR', name: 'Fribourg' },
  11: { code: 'SO', name: 'Soleure' },
  12: { code: 'BS', name: 'Bâle-Ville' },
  13: { code: 'BL', name: 'Bâle-Campagne' },
  14: { code: 'SH', name: 'Schaffhouse' },
  15: { code: 'AR', name: 'Appenzell Rh.-Ext.' },
  16: { code: 'AI', name: 'Appenzell Rh.-Int.' },
  17: { code: 'SG', name: 'Saint-Gall' },
  18: { code: 'GR', name: 'Grisons' },
  19: { code: 'AG', name: 'Argovie' },
  20: { code: 'TG', name: 'Thurgovie' },
  21: { code: 'TI', name: 'Tessin' },
  22: { code: 'VD', name: 'Vaud' },
  23: { code: 'VS', name: 'Valais' },
  24: { code: 'NE', name: 'Neuchâtel' },
  25: { code: 'GE', name: 'Genève' },
  26: { code: 'JU', name: 'Jura' },
};

// Mapping FSO district id (Vaud) → code + nom complet
const DISTRICTS_VD = {
  2221: { code: 'AIG', name: 'Aigle' },
  2222: { code: 'BRV', name: 'Broye-Vully' },
  2223: { code: 'GDV', name: 'Gros-de-Vaud' },
  2224: { code: 'JNV', name: 'Jura-Nord vaudois' },
  2225: { code: 'LAU', name: 'Lausanne' },
  2226: { code: 'LVO', name: 'Lavaux-Oron' },
  2227: { code: 'MOR', name: 'Morges' },
  2228: { code: 'NYO', name: 'Nyon' },
  2229: { code: 'OUL', name: 'Ouest lausannois' },
  2230: { code: 'RPE', name: "Riviera-Pays-d'Enhaut" },
};
const RIVIERA_PAYS_ENHAUT_ID = 2230;

const COLOR_HIGHLIGHT = '#003366';
const COLOR_BASE = '#E5E7EB';
const COLOR_STROKE = '#FFFFFF';
const COLOR_DOT = '#E52A21';

export default function SwissMap() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/maps/ch-combined.json')
      .then((r) => {
        if (!r.ok) throw new Error('fichier ch-combined.json introuvable');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div style={styles.statusBox}>Carte indisponible : {error}</div>;
  if (!data) return <div style={styles.statusBox}>Chargement de la carte…</div>;

  const cantonsObj =
    data.objects.cantons ||
    data.objects.kantone ||
    Object.values(data.objects).find((o) => o.geometries && o.geometries.length === 26);
  const districtsObj = data.objects.districts || data.objects.bezirke;

  if (!cantonsObj) return <div style={styles.statusBox}>Couche « cantons » introuvable.</div>;

  const cantons = topojson.feature(data, cantonsObj);
  const districts = districtsObj ? topojson.feature(data, districtsObj) : null;

  const getId = (f) => f.id ?? f.properties?.id;
  const isVaud = (f) => getId(f) === 22;
  const isInVaudCanton = (f) => {
    const id = getId(f);
    return typeof id === 'number' && id >= 2200 && id < 2300;
  };
  const isRivieraPaysEnhaut = (f) => getId(f) === RIVIERA_PAYS_ENHAUT_ID;

  // --- Carte Suisse ---
  const swissW = 720;
  const swissH = 440;
  const swissProj = geoMercator().fitSize([swissW, swissH], cantons);
  const swissPath = geoPath(swissProj);

  // --- Carte Vaud ---
  let vaudBlock = null;
  if (districts) {
    const vaudFeatures = districts.features.filter(isInVaudCanton);
    if (vaudFeatures.length > 0) {
      const vaudW = 720;
      const vaudH = 440;
      const vaudCollection = { type: 'FeatureCollection', features: vaudFeatures };
      const vaudProj = geoMercator().fitSize([vaudW, vaudH], vaudCollection);
      const vaudPath = geoPath(vaudProj);
      const [cx, cy] = vaudProj(CHARDONNE_COORDS);

      vaudBlock = (
        <div style={styles.mapBlock}>
          <h4 style={styles.mapTitle}>CANTON DE VAUD — DISTRICTS</h4>
          <div style={styles.mapAndLegend}>
            <svg viewBox={`0 0 ${vaudW} ${vaudH}`} style={styles.mapSvg}>
              {vaudFeatures.map((f, i) => {
                const highlighted = isRivieraPaysEnhaut(f);
                const [labelX, labelY] = vaudPath.centroid(f);
                const abbrev = DISTRICTS_VD[getId(f)]?.code || '';
                return (
                  <g key={i}>
                    <path
                      d={vaudPath(f)}
                      fill={highlighted ? COLOR_HIGHLIGHT : COLOR_BASE}
                      stroke={COLOR_STROKE}
                      strokeWidth="0.8"
                    />
                    {abbrev && Number.isFinite(labelX) && (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          ...styles.mapCode,
                          fill: highlighted ? '#FFFFFF' : '#333333',
                        }}
                      >
                        {abbrev}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Chardonne */}
              <circle cx={cx} cy={cy} r={14} fill={COLOR_DOT} opacity="0.2" />
              <circle cx={cx} cy={cy} r={6} fill={COLOR_DOT} stroke="#FFFFFF" strokeWidth="2" />
              <text
                x={cx + 12}
                y={cy + 4}
                style={{ ...styles.chardonneLabel }}
              >
                Chardonne
              </text>
            </svg>

            <div style={styles.legendList}>
              {vaudFeatures
                .map((f) => ({ id: getId(f), info: DISTRICTS_VD[getId(f)] }))
                .filter((d) => d.info)
                .sort((a, b) => a.info.name.localeCompare(b.info.name, 'fr'))
                .map(({ id, info }) => {
                  const isHighlight = id === RIVIERA_PAYS_ENHAUT_ID;
                  return (
                    <div
                      key={id}
                      style={{
                        ...styles.legendRow,
                        background: isHighlight ? '#F0F4FA' : 'transparent',
                      }}
                    >
                      <span
                        style={{
                          ...styles.legendCode,
                          background: isHighlight ? COLOR_HIGHLIGHT : '#D1D5DB',
                          color: isHighlight ? '#FFFFFF' : '#333333',
                        }}
                      >
                        {info.code}
                      </span>
                      <span style={styles.legendName}>{info.name}</span>
                    </div>
                  );
                })}
              <div style={{ ...styles.legendRow, marginTop: '0.5rem', borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem' }}>
                <span style={{ ...styles.legendCode, background: COLOR_DOT, color: 'white', borderRadius: '50%' }}>•</span>
                <span style={styles.legendName}>Chardonne</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Tri par code pour la légende suisse
  const sortedCantons = [...cantons.features].sort((a, b) => {
    const ca = CANTONS[getId(a)]?.code || '';
    const cb = CANTONS[getId(b)]?.code || '';
    return ca.localeCompare(cb);
  });

  return (
    <div style={styles.stack}>
      <div style={styles.mapBlock}>
        <h4 style={styles.mapTitle}>CONFÉDÉRATION SUISSE — CANTONS</h4>
        <div style={styles.mapAndLegend}>
          <svg viewBox={`0 0 ${swissW} ${swissH}`} style={styles.mapSvg}>
            {cantons.features.map((f, i) => {
              const id = getId(f);
              const info = CANTONS[id];
              const highlighted = isVaud(f);
              const [labelX, labelY] = swissPath.centroid(f);
              return (
                <g key={i}>
                  <path
                    d={swissPath(f)}
                    fill={highlighted ? COLOR_HIGHLIGHT : COLOR_BASE}
                    stroke={COLOR_STROKE}
                    strokeWidth="0.8"
                  />
                  {info && Number.isFinite(labelX) && (
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        ...styles.mapCode,
                        fill: highlighted ? '#FFFFFF' : '#333333',
                      }}
                    >
                      {info.code}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div style={{ ...styles.legendList, columns: 2, columnGap: '0.5rem' }}>
            {sortedCantons.map((f) => {
              const id = getId(f);
              const info = CANTONS[id];
              if (!info) return null;
              const highlight = isVaud(f);
              return (
                <div
                  key={id}
                  style={{
                    ...styles.legendRow,
                    breakInside: 'avoid',
                    background: highlight ? '#F0F4FA' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      ...styles.legendCode,
                      background: highlight ? COLOR_HIGHLIGHT : '#D1D5DB',
                      color: highlight ? '#FFFFFF' : '#333333',
                    }}
                  >
                    {info.code}
                  </span>
                  <span style={styles.legendName}>{info.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {vaudBlock}
    </div>
  );
}

const styles = {
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    margin: '1rem 0',
  },
  mapBlock: {
    background: 'white',
    padding: '1.25rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
  },
  mapTitle: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    fontWeight: 700,
    color: '#666',
    margin: '0 0 1rem 0',
    textAlign: 'center',
  },
  mapAndLegend: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2.2fr) minmax(220px, 1fr)',
    gap: '1.5rem',
    alignItems: 'start',
  },
  mapSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  mapCode: {
    fontSize: '13px',
    fontWeight: 700,
    pointerEvents: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  chardonneLabel: {
    fontSize: '12px',
    fontWeight: 700,
    fill: '#1A1A1A',
    paintOrder: 'stroke',
    stroke: '#FFFFFF',
    strokeWidth: '3px',
  },
  legendList: {
    fontSize: '0.8rem',
    color: '#1A1A1A',
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.4rem',
    borderRadius: '4px',
  },
  legendCode: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '20px',
    padding: '0 0.4rem',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    borderRadius: '3px',
    flexShrink: 0,
  },
  legendName: {
    flex: 1,
    fontSize: '0.8rem',
  },
  statusBox: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666',
    background: 'white',
    borderRadius: '8px',
    border: '1px dashed #CCC',
    margin: '1rem 0',
  },
};
