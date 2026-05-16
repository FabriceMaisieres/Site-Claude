import React, { useEffect, useState } from 'react';
import * as topojson from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

// Coordonnées approximatives de Chardonne
const CHARDONNE_COORDS = [6.8189, 46.4823];

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

  if (error) {
    return (
      <div style={styles.statusBox}>
        Carte indisponible : {error}
      </div>
    );
  }
  if (!data) {
    return <div style={styles.statusBox}>Chargement de la carte…</div>;
  }

  // Repérage des couches : cantons et districts
  const cantonsObj =
    data.objects.cantons ||
    data.objects.kantone ||
    Object.values(data.objects).find((o) => o.geometries && o.geometries.length === 26);
  const districtsObj = data.objects.districts || data.objects.bezirke;

  if (!cantonsObj) {
    return <div style={styles.statusBox}>Couche « cantons » introuvable dans le TopoJSON.</div>;
  }

  const cantons = topojson.feature(data, cantonsObj);
  const districts = districtsObj ? topojson.feature(data, districtsObj) : null;

  const isVaud = (f) => {
    const id = f.properties?.id ?? f.id;
    const name = f.properties?.name || '';
    return id === 22 || /vaud/i.test(name);
  };

  const isRivieraPaysEnhaut = (f) => {
    const name = f.properties?.name || '';
    return /Riviera/i.test(name);
  };

  const isInVaudCanton = (f) => {
    const id = f.properties?.id ?? f.id;
    if (typeof id === 'number') {
      return id >= 2200 && id < 2300;
    }
    return false;
  };

  // --- Carte 1 : Suisse ---
  const swissW = 500;
  const swissH = 320;
  const swissProj = geoMercator().fitSize([swissW, swissH], cantons);
  const swissPath = geoPath(swissProj);

  // --- Carte 2 : Vaud avec districts ---
  let vaudBlock = null;
  if (districts) {
    const vaudFeatures = districts.features.filter(isInVaudCanton);
    if (vaudFeatures.length > 0) {
      const vaudW = 500;
      const vaudH = 320;
      const vaudCollection = { type: 'FeatureCollection', features: vaudFeatures };
      const vaudProj = geoMercator().fitSize([vaudW, vaudH], vaudCollection);
      const vaudPath = geoPath(vaudProj);

      const [cx, cy] = vaudProj(CHARDONNE_COORDS);

      vaudBlock = (
        <div style={styles.mapBlock}>
          <h4 style={styles.mapTitle}>CANTON DE VAUD</h4>
          <svg viewBox={`0 0 ${vaudW} ${vaudH}`} style={styles.mapSvg}>
            {vaudFeatures.map((f, i) => (
              <path
                key={i}
                d={vaudPath(f)}
                fill={isRivieraPaysEnhaut(f) ? '#003366' : '#E5E7EB'}
                stroke="#FFFFFF"
                strokeWidth="0.6"
              />
            ))}
            {/* halo Chardonne */}
            <circle cx={cx} cy={cy} r={10} fill="#E52A21" opacity="0.25" />
            <circle cx={cx} cy={cy} r={5} fill="#E52A21" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x={cx + 10} y={cy + 4} style={styles.mapLabel}>
              Chardonne
            </text>
          </svg>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#003366' }} />
              District Riviera-Pays-d'Enhaut
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#E52A21', borderRadius: '50%' }} />
              Chardonne
            </span>
          </div>
        </div>
      );
    }
  }

  return (
    <div style={styles.row}>
      <div style={styles.mapBlock}>
        <h4 style={styles.mapTitle}>CONFÉDÉRATION SUISSE</h4>
        <svg viewBox={`0 0 ${swissW} ${swissH}`} style={styles.mapSvg}>
          {cantons.features.map((f, i) => (
            <path
              key={i}
              d={swissPath(f)}
              fill={isVaud(f) ? '#003366' : '#E5E7EB'}
              stroke="#FFFFFF"
              strokeWidth="0.6"
            />
          ))}
        </svg>
        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#003366' }} />
            Canton de Vaud
          </span>
        </div>
      </div>
      {vaudBlock}
    </div>
  );
}

const styles = {
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    margin: '1rem 0',
  },
  mapBlock: {
    background: 'white',
    padding: '1.25rem',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
  },
  mapTitle: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    fontWeight: 700,
    color: '#666',
    margin: '0 0 0.75rem 0',
    textAlign: 'center',
  },
  mapSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  mapLabel: {
    fontSize: '11px',
    fontWeight: 600,
    fill: '#1A1A1A',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '0.75rem',
    fontSize: '0.75rem',
    color: '#666',
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  legendDot: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
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
