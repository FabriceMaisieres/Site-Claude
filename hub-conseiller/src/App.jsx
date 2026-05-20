import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, FileText, Building2, Scale, Book, Home, Menu, X, Users, Vote, Mail, PanelLeftClose, PanelLeftOpen, Newspaper, BarChart3 } from 'lucide-react';
import SwissMap from './SwissMap.jsx';
import votationsData from './data/votations.json';

// Logos officiels (servis depuis le dossier public/)
const LOGO_SUISSE = "/logo_suisse.jpeg";
const LOGO_VAUD = "/logo_vaud.jpeg";
const LOGO_CHARDONNE = "/chardonne-vector-logo.svg";

// Données complètes du règlement
// Données complètes du règlement
const reglementsData = {
  communal: {
    conseilCommunal: {
      titre: "Règlement du Conseil communal",
      dateApprobation: "11 septembre 2015",
      sections: [
        {
          titre: "TITRE I - Du conseil et de ses organes",
          chapitres: [
            {
              numero: "I",
              titre: "Formation du conseil",
              articles: [
                { numero: "1", titre: "Nombre de membres", contenu: "Le nombre des membres est fixé selon l'effectif de la population de la commune issu du recensement annuel. Le conseil communal peut modifier le nombre de ses membres au plus tard le 30 juin de l'année précédant le renouvellement intégral des autorités communales." },
                { numero: "2", titre: "Election", contenu: "Le corps électoral est convoqué tous les cinq ans, au printemps, pour procéder à l'élection des membres du conseil. Cette élection a lieu conformément à la LEDP selon le système proportionnel." },
                { numero: "3", titre: "Qualité d'électeurs", contenu: "Les membres du conseil doivent être des électeurs au sens de l'art. 5 LEDP. S'ils perdent la qualité d'électeurs dans la commune, ils sont réputés démissionnaires." }
              ]
            },
            {
              numero: "II",
              titre: "Organisation du conseil",
              articles: [
                { numero: "13", titre: "Bureau", contenu: "Le conseil communal nomme chaque année, pour le 1er juillet, en son sein:\na) un président,\nb) un premier vice-président,\nc) un deuxième vice-président,\nc) deux scrutateurs et deux suppléants." },
                { numero: "14", titre: "Nomination", contenu: "Le président, les vice-présidents et le secrétaire sont nommés au scrutin individuel secret. Les scrutateurs sont élus au scrutin de liste, les bulletins blancs sont pris en compte dans le calcul de la majorité absolue." }
              ]
            },
            {
              numero: "III",
              titre: "Attributions et compétences",
              articles: [
                { numero: "19", titre: "Du conseil", contenu: "Le conseil délibère sur:\na) le contrôle de la gestion;\nb) le projet de budget et les comptes;\nc) les propositions de dépenses extrabudgétaires;\nd) le projet d'arrêté d'imposition;\ne) l'acquisition et l'aliénation d'immeubles..." }
              ]
            },
            {
              numero: "IV",
              titre: "Des commissions",
              articles: [
                { numero: "39", titre: "Composition - attributions", contenu: "Toute commission est composée de cinq membres au moins. Il est tenu compte d'une représentation équitable des divers groupes politiques du conseil conformément à l'art. 12 alinéa 2." },
                { numero: "41", titre: "Commission des finances", contenu: "Le conseil élit avant le 1er juillet, une commission des finances. Ses membres sont au nombre de sept, désignés pour un an et rééligibles. La commission des finances est chargée d'examiner le budget, les dépenses supplémentaires, les propositions d'emprunt, le projet d'arrêté d'imposition et les propositions d'investissement." },
                { numero: "42", titre: "Commission de gestion", contenu: "Le conseil élit avant le 1er juillet, une commission de gestion chargée d'examiner la gestion et les comptes de l'année écoulée. Cette commission est composée de sept membres. Aucun membre du personnel communal ne peut en faire partie." },
                { numero: "43", titre: "Commission de recours en matière d'impôts communaux", contenu: "Le conseil élit une commission de recours en matière d'impôts communaux. Ses membres sont au nombre de cinq, élus au début de chaque législature et pour la durée de celle-ci." }
              ]
            }
          ]
        },
        {
          titre: "TITRE II - Travaux généraux du conseil",
          chapitres: [
            {
              numero: "I",
              titre: "Des assemblées du conseil",
              articles: [
                { numero: "58", titre: "Convocation", contenu: "Le conseil s'assemble en général à la maison de commune. Il est convoqué par écrit par son président, à défaut par l'un des vice-présidents ou, en cas d'empêchement de ceux-ci, par un des membres du bureau." }
              ]
            }
          ]
        },
        {
          titre: "TITRE III - Budget, gestion et comptes",
          chapitres: [
            {
              numero: "I",
              titre: "Budget et crédits d'investissements",
              articles: [
                { numero: "99", titre: "Budget de fonctionnement", contenu: "Le conseil autorise les dépenses courantes de la commune par l'adoption du budget de fonctionnement que la municipalité lui soumet." }
              ]
            }
          ]
        }
      ]
    }
  }
};

const commissions = [
  {
    nom: "Commission des finances",
    type: "Permanente",
    membres: 7,
    mandat: "1 an (rééligible)",
    fonction: "Examiner le budget, les dépenses supplémentaires, les propositions d'emprunt, le projet d'arrêté d'imposition et les propositions d'investissement"
  },
  {
    nom: "Commission de gestion",
    type: "Permanente",
    membres: 7,
    mandat: "1 an (rééligible)",
    fonction: "Examiner la gestion et les comptes de l'année écoulée"
  },
  {
    nom: "Commission de recours en matière d'impôts",
    type: "Permanente",
    membres: 5,
    mandat: "Durée de la législature",
    fonction: "Traiter les recours contre les décisions en matière d'impôts ou taxes communaux"
  },
  {
    nom: "Commissions ad hoc",
    type: "Temporaire",
    membres: "Variable (min. 5)",
    mandat: "Variable",
    fonction: "Examiner les propositions des membres du conseil et les pétitions"
  }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedChapitres, setExpandedChapitres] = useState({});
  const [dateTime, setDateTime] = useState(new Date());
  const [sidebarHidden, setSidebarHidden] = useState(false);

  // Mise à jour de l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { id: 'accueil', label: 'Accueil', icon: Home, category: null },
    { id: 'cantonal', label: 'Canton de Vaud', icon: Book, category: 'CANTON' },
    { id: 'district', label: 'District Riviera-Pays-d\'Enhaut', icon: Building2, category: 'DISTRICT' },
    { id: 'communal', label: 'Règlements communaux', icon: Building2, category: 'COMMUNE' },
    { id: 'commissions', label: 'Commissions', icon: FileText, category: 'COMMUNE' },
    { id: 'documents', label: 'Documents officiels (site web)', icon: FileText, category: 'COMMUNE' },
    { id: 'rues', label: 'Carte & Rues', icon: FileText, category: 'COMMUNE' },
    { id: 'elections', label: 'Élections 2026', icon: BarChart3, category: 'COMMUNE' },
    { id: 'csp-presentation', label: 'Présentation', icon: Users, category: 'CHARDONNE SANS PARTI' },
    { id: 'csp-programme', label: 'Programme & Élections 2026', icon: Vote, category: 'CHARDONNE SANS PARTI' },
    { id: 'csp-elus', label: 'Élus & Contact', icon: Mail, category: 'CHARDONNE SANS PARTI' },
    { id: 'votations', label: 'Votations', icon: Vote, category: 'VOTATIONS' },
    { id: 'medias', label: 'Presse & médias', icon: Newspaper, category: 'MÉDIAS' }
  ];

  const toggleChapitre = (sectionIndex, chapitreIndex) => {
    const key = `${sectionIndex}-${chapitreIndex}`;
    setExpandedChapitres(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderAccueil = () => (
    <div className="content-space" style={{ maxWidth: '1300px' }}>
      <div className="header-block">
        <div className="swiss-cross">+</div>
        <h1 className="main-title">BIENVENUE</h1>
        <h2 className="sub-title">COMMUNE DE CHARDONNE</h2>
        <div className="divider"></div>
        <p className="intro-text">
          Ce site rassemble les références, règlements et documents officiels utiles
          au travail de conseiller communal. Que ce soit pour préparer une séance,
          vérifier un article du règlement, identifier une commission ou retrouver
          un préavis municipal, vous y trouverez les ressources nécessaires à vos
          recherches et à vos sessions de travail.
        </p>
      </div>

      <div className="section-block">
        <h3 className="section-heading">OÙ SE SITUE CHARDONNE</h3>
        <SwissMap />
      </div>

      <div className="section-block">
        <h3 className="section-heading">INFORMATIONS GÉNÉRALES</h3>
        <div className="grid-3">
          <div className="info-card">
            <div className="card-label">CANTON</div>
            <div className="card-value">Vaud</div>
          </div>
          <div className="info-card">
            <div className="card-label">DISTRICT</div>
            <div className="card-value">Riviera-Pays-d'Enhaut</div>
          </div>
          <div className="info-card">
            <div className="card-label">AUTORITÉ</div>
            <div className="card-value">Conseil communal</div>
          </div>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-heading">ACCÈS AUX DOCUMENTS</h3>
        <div className="nav-grid">
          {navigation.slice(1, 5).map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className="nav-button">
                <Icon size={24} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="resource-block">
        <h3 className="section-heading">RESSOURCES CANTONALES</h3>
        <a href="https://publication.vd.ch/publications/dgaic/aide-memoire/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Aide-mémoire communal vaudois</div>
            <div className="resource-meta">Publication officielle – Canton de Vaud</div>
          </div>
          <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );

  const renderCommunal = () => {
    const reglement = reglementsData.communal.conseilCommunal;
    
    return (
      <div className="content-space">
        <div className="doc-header">
          <h1 className="doc-title">{reglement.titre}</h1>
          <p className="doc-meta">Approuvé le {reglement.dateApprobation}</p>
        </div>

        <div className="pdf-actions">
          <a 
            href="/documents/reglement-cc-chardonne.pdf" 
            download
            className="pdf-button download"
          >
            <span className="pdf-icon">📄</span>
            <span>Télécharger le PDF officiel</span>
          </a>
          <a 
            href="/documents/reglement-cc-chardonne.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-button view"
          >
            <span className="pdf-icon">👁️</span>
            <span>Visualiser le PDF</span>
          </a>
        </div>

        <div className="reglement-content">
          {reglement.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section-wrapper">
              <h2 className="titre-section">{section.titre}</h2>
              
              {section.chapitres.map((chapitre, chapitreIndex) => {
                const isExpanded = expandedChapitres[`${sectionIndex}-${chapitreIndex}`];
                
                return (
                  <div key={chapitreIndex} className="chapitre-wrapper">
                    <button
                      onClick={() => toggleChapitre(sectionIndex, chapitreIndex)}
                      className="chapitre-toggle"
                    >
                      <div className="chapitre-info">
                        <span className="chapitre-num">CHAPITRE {chapitre.numero}</span>
                        <span className="chapitre-name">{chapitre.titre}</span>
                      </div>
                      <ChevronRight className={`toggle-icon ${isExpanded ? 'expanded' : ''}`} />
                    </button>
                    
                    {isExpanded && (
                      <div className="articles-container">
                        {chapitre.articles.map((article, articleIndex) => (
                          <div key={articleIndex} className="article-box">
                            <div className="article-num">ART. {article.numero}</div>
                            {article.titre && <div className="article-title">{article.titre}</div>}
                            <div className="article-text">{article.contenu}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCommissions = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">LES COMMISSIONS</h1>
        <p className="doc-meta">Organisation et fonctionnement</p>
      </div>

      <div className="commissions-list">
        {commissions.map((commission, index) => (
          <div key={index} className="commission-block">
            <div className="commission-header">
              <h3 className="commission-name">{commission.nom}</h3>
              <span className={`badge ${commission.type.toLowerCase()}`}>
                {commission.type}
              </span>
            </div>
            <table className="commission-table">
              <tbody>
                <tr>
                  <td className="table-key">Membres</td>
                  <td className="table-val">{commission.membres}</td>
                </tr>
                <tr>
                  <td className="table-key">Mandat</td>
                  <td className="table-val">{commission.mandat}</td>
                </tr>
                <tr>
                  <td className="table-key">Fonction</td>
                  <td className="table-val">{commission.fonction}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="info-panel">
        <h3 className="panel-title">PRINCIPES GÉNÉRAUX</h3>
        <ul className="principles-list">
          <li>Minimum 5 membres par commission</li>
          <li>Représentation équitable des groupes politiques</li>
          <li>Élection annuelle avant le 1er juillet pour les commissions permanentes</li>
          <li>Secret de fonction obligatoire</li>
          <li>Rapports écrits déposés 3 jours avant la séance du conseil</li>
        </ul>
      </div>
    </div>
  );

  const renderDistrict = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">DISTRICT DE LA RIVIERA-PAYS-D'ENHAUT</h1>
        <p className="doc-meta">Organisation administrative et préfecture</p>
      </div>

      <div className="intro-panel">
        <p className="intro-text-canton">
          Le district de la Riviera-Pays-d'Enhaut est l'un des 10 districts du Canton de Vaud. Créé le 
          1er janvier 2008 lors de la réorganisation cantonale, il regroupe 12 communes de la Riviera 
          lémanique et du Pays-d'Enhaut alpin, avec Vevey comme chef-lieu.
        </p>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LES PRÉFETS</h2>
        <div className="institution-card">
          <div className="institution-header">
            <div className="institution-icon-large">👔</div>
            <div className="institution-intro">
              <h3 className="institution-name">Préfecture du district</h3>
              <p className="institution-subtitle">Représentants du Conseil d'État dans le district</p>
            </div>
          </div>

          <div className="prefets-grid">
            <div className="prefet-card">
              <div className="prefet-name">M. Roland Berdoz</div>
              <div className="prefet-role">Préfet à 100%</div>
              <p className="prefet-description">
                En fonction depuis 2008, Roland Berdoz représente l'État de Vaud dans le district de 
                "la plage à l'alpage". Originaire du Pays-d'Enhaut, il cumule près de 20 ans d'expérience 
                comme magistrat.
              </p>
            </div>

            <div className="prefet-card">
              <div className="prefet-name">M. Fabrice Neyroud</div>
              <div className="prefet-role">Préfet à 50%</div>
              <p className="prefet-description">
                Député au Grand Conseil vaudois, Fabrice Neyroud est également
                vigneron-encaveur. Nommé préfet en 2023, il succède à Florence Siegrist.
              </p>
            </div>
          </div>

          <div className="institution-details">
            <h4 className="detail-section-title">MISSIONS DU PRÉFET</h4>
            <div className="detail-row">
              <div className="detail-label">🏛️ Représentation</div>
              <div className="detail-value">Représenter le Conseil d'État cantonal au niveau du district</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">👁️ Surveillance</div>
              <div className="detail-value">Surveiller l'administration des communes du district</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">⚖️ Justice & Police</div>
              <div className="detail-value">Autorité de justice de paix et de police administrative</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">📋 État civil</div>
              <div className="detail-value">Gérer les offices d'état civil et le registre foncier</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">🤝 Médiation</div>
              <div className="detail-value">Rôle de médiateur entre l'État et les communes</div>
            </div>
          </div>

          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/riviera-pays-denhaut" target="_blank" rel="noopener noreferrer" className="institution-link">
            Visiter le site de la Préfecture
            <ChevronRight size={18} />
          </a>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LE DISTRICT EN CHIFFRES</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-value">Vevey</div>
            <div className="stat-label">Chef-lieu</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏘️</div>
            <div className="stat-value">12</div>
            <div className="stat-label">Communes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">~85'000</div>
            <div className="stat-label">Habitants</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-value">286 km²</div>
            <div className="stat-label">Superficie</div>
          </div>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LES 12 COMMUNES DU DISTRICT</h2>
        <div className="communes-grid">
          <a href="https://www.blonay-saint-legier.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏔️</span>
            <span className="commune-name">Blonay-Saint-Légier</span>
          </a>
          <a href="https://www.chardonne.ch" target="_blank" rel="noopener noreferrer" className="commune-item commune-highlight">
            <span className="commune-icon">🏛️</span>
            <span className="commune-name">Chardonne</span>
            <span className="commune-badge">Vous êtes ici</span>
          </a>
          <a href="https://www.chateau-doex.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏔️</span>
            <span className="commune-name">Château-d'Œx</span>
          </a>
          <a href="https://www.corseaux.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🍇</span>
            <span className="commune-name">Corseaux</span>
          </a>
          <a href="https://www.corsier.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🍇</span>
            <span className="commune-name">Corsier-sur-Vevey</span>
          </a>
          <a href="https://www.jongny.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🍇</span>
            <span className="commune-name">Jongny</span>
          </a>
          <a href="https://www.montreux.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🎵</span>
            <span className="commune-name">Montreux</span>
          </a>
          <a href="https://www.rossiniere.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏔️</span>
            <span className="commune-name">Rossinière</span>
          </a>
          <a href="https://www.rougemont.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏔️</span>
            <span className="commune-name">Rougemont</span>
          </a>
          <a href="https://www.latdp.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏖️</span>
            <span className="commune-name">La Tour-de-Peilz</span>
          </a>
          <a href="https://www.vevey.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏛️</span>
            <span className="commune-name">Vevey</span>
          </a>
          <a href="https://www.veytaux.ch" target="_blank" rel="noopener noreferrer" className="commune-item">
            <span className="commune-icon">🏰</span>
            <span className="commune-name">Veytaux</span>
          </a>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LES 10 DISTRICTS DU CANTON DE VAUD</h2>
        <p className="section-intro">
          Le Canton de Vaud est organisé en 10 districts depuis la réforme territoriale de 2008. 
          Chaque district regroupe plusieurs communes et est administré par une préfecture.
        </p>
        <div className="districts-grid">
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/aigle" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🏔️</span>
            <span className="district-name">District d'Aigle</span>
            <span className="district-meta">Chef-lieu : Aigle</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/broye-vully" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🌾</span>
            <span className="district-name">District de Broye-Vully</span>
            <span className="district-meta">Chef-lieu : Payerne</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/gros-de-vaud" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🌾</span>
            <span className="district-name">District du Gros-de-Vaud</span>
            <span className="district-meta">Chef-lieu : Echallens</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/jura-nord-vaudois" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🌲</span>
            <span className="district-name">District du Jura-Nord vaudois</span>
            <span className="district-meta">Chef-lieu : Yverdon-les-Bains</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/lausanne" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🏛️</span>
            <span className="district-name">District de Lausanne</span>
            <span className="district-meta">Chef-lieu : Lausanne</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/lavaux-oron" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🍇</span>
            <span className="district-name">District de Lavaux-Oron</span>
            <span className="district-meta">Chef-lieu : Cully</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/morges" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🏖️</span>
            <span className="district-name">District de Morges</span>
            <span className="district-meta">Chef-lieu : Morges</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/nyon" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🏖️</span>
            <span className="district-name">District de Nyon</span>
            <span className="district-meta">Chef-lieu : Nyon</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/ouest-lausannois" target="_blank" rel="noopener noreferrer" className="district-item">
            <span className="district-icon">🏙️</span>
            <span className="district-name">District de l'Ouest lausannois</span>
            <span className="district-meta">Chef-lieu : Renens</span>
          </a>
          <a href="https://www.vd.ch/etat-droit-finances/districts-/-prefectures/prefectures/riviera-pays-denhaut" target="_blank" rel="noopener noreferrer" className="district-item district-highlight">
            <span className="district-icon">🎵</span>
            <span className="district-name">District de la Riviera-Pays-d'Enhaut</span>
            <span className="district-meta">Chef-lieu : Vevey</span>
            <span className="commune-badge">Votre district</span>
          </a>
        </div>
      </div>

      <div className="info-panel">
        <h3 className="panel-title">HISTOIRE DU DISTRICT</h3>
        <p className="panel-text">
          Le district de la Riviera-Pays-d'Enhaut a été créé le 1er janvier 2008 lors de la réorganisation 
          territoriale du Canton de Vaud. Il résulte de la fusion des anciens districts de Vevey et du 
          Pays-d'Enhaut, formant ainsi un territoire qui s'étend des rives du Léman aux sommets alpins.
        </p>
      </div>
    </div>
  );

  const renderCantonal = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">CANTON DE VAUD</h1>
        <p className="doc-meta">Organisation politique et institutionnelle</p>
      </div>

      <div className="intro-panel">
        <p className="intro-text-canton">
          Le Canton de Vaud est une démocratie représentative fondée sur la séparation des trois pouvoirs : 
          législatif, exécutif et judiciaire. Les citoyennes et citoyens vaudois participent activement 
          à la vie politique à travers les élections et les droits populaires.
        </p>
      </div>

      <div className="powers-section">
        <h2 className="section-title-canton">LES TROIS POUVOIRS</h2>
        
        <div className="powers-grid">
          <div className="power-card">
            <div className="power-icon">⚖️</div>
            <h3 className="power-name">POUVOIR LÉGISLATIF</h3>
            <div className="power-institution">Grand Conseil</div>
            <p className="power-description">
              Vote les lois, adopte le budget cantonal et contrôle l'action du Conseil d'État.
            </p>
          </div>

          <div className="power-card">
            <div className="power-icon">🏛️</div>
            <h3 className="power-name">POUVOIR EXÉCUTIF</h3>
            <div className="power-institution">Conseil d'État</div>
            <p className="power-description">
              Gouverne le canton, met en œuvre les lois et dirige l'administration cantonale.
            </p>
          </div>

          <div className="power-card">
            <div className="power-icon">⚖️</div>
            <h3 className="power-name">POUVOIR JUDICIAIRE</h3>
            <div className="power-institution">Tribunal cantonal</div>
            <p className="power-description">
              Rend la justice, garantit l'application du droit et juge en dernière instance cantonale.
            </p>
          </div>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LE GRAND CONSEIL</h2>
        <div className="institution-card">
          <div className="institution-header">
            <div className="institution-icon-large">🏛️</div>
            <div className="institution-intro">
              <h3 className="institution-name">Parlement cantonal</h3>
              <p className="institution-subtitle">Pouvoir législatif du Canton de Vaud</p>
            </div>
          </div>

          <div className="institution-details">
            <div className="detail-row">
              <div className="detail-label">👥 Composition</div>
              <div className="detail-value">150 députés élus au suffrage universel</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">📅 Mandat</div>
              <div className="detail-value">5 ans (système proportionnel)</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">🗳️ Élections</div>
              <div className="detail-value">10 cercles électoraux (districts)</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">📋 Missions principales</div>
              <div className="detail-value">
                • Voter les lois et décrets<br/>
                • Adopter le budget cantonal<br/>
                • Contrôler le Conseil d'État<br/>
                • Examiner les initiatives et pétitions
              </div>
            </div>
          </div>

          <a href="https://www.vd.ch/grand-conseil" target="_blank" rel="noopener noreferrer" className="institution-link">
            Visiter le site du Grand Conseil
            <ChevronRight size={18} />
          </a>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LE CONSEIL D'ÉTAT</h2>
        <div className="institution-card">
          <div className="institution-header">
            <div className="institution-icon-large">👔</div>
            <div className="institution-intro">
              <h3 className="institution-name">Gouvernement cantonal</h3>
              <p className="institution-subtitle">Pouvoir exécutif du Canton de Vaud</p>
            </div>
          </div>

          <div className="institution-details">
            <div className="detail-row">
              <div className="detail-label">👥 Composition</div>
              <div className="detail-value">7 conseillers d'État élus au suffrage universel</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">📅 Mandat</div>
              <div className="detail-value">5 ans (système majoritaire)</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">🎯 Missions principales</div>
              <div className="detail-value">
                • Mettre en œuvre les lois<br/>
                • Diriger l'administration cantonale<br/>
                • Représenter le canton<br/>
                • Préparer les projets de loi
              </div>
            </div>
          </div>

          <div className="departments-section">
            <h4 className="departments-title">LES 7 DÉPARTEMENTS</h4>
            <div className="departments-grid">
              <div className="department-item">
                <span className="dept-icon">🏛️</span>
                <span className="dept-name">Présidence (DGE)</span>
              </div>
              <div className="department-item">
                <span className="dept-icon">💰</span>
                <span className="dept-name">Finances (DFIRE)</span>
              </div>
              <div className="department-item">
                <span className="dept-icon">🏥</span>
                <span className="dept-name">Santé et action sociale (DSAS)</span>
              </div>
              <div className="department-item">
                <span className="dept-icon">📚</span>
                <span className="dept-name">Formation et jeunesse (DFJC)</span>
              </div>
              <div className="department-item">
                <span className="dept-icon">🌲</span>
                <span className="dept-name">Territoire et environnement (DGTL)</span>
              </div>
              <div className="department-item">
                <span className="dept-icon">🚗</span>
                <span className="dept-name">Mobilités et infrastructures (DGMR)</span>
              </div>
              <div className="department-item">
                <span className="dept-icon">💼</span>
                <span className="dept-name">Économie et sport (DECS)</span>
              </div>
            </div>
          </div>

          <a href="https://www.vd.ch/conseil-detat" target="_blank" rel="noopener noreferrer" className="institution-link">
            Visiter le site du Conseil d'État
            <ChevronRight size={18} />
          </a>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">LE TRIBUNAL CANTONAL</h2>
        <div className="institution-card">
          <div className="institution-header">
            <div className="institution-icon-large">⚖️</div>
            <div className="institution-intro">
              <h3 className="institution-name">Cour suprême cantonale</h3>
              <p className="institution-subtitle">Pouvoir judiciaire du Canton de Vaud</p>
            </div>
          </div>

          <div className="institution-details">
            <div className="detail-row">
              <div className="detail-label">🎯 Mission</div>
              <div className="detail-value">Garantir l'application du droit et rendre la justice en dernière instance cantonale</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">📋 Principales cours</div>
              <div className="detail-value">
                • Cour d'appel civile<br/>
                • Cour d'appel pénal<br/>
                • Cour de droit administratif et public<br/>
                • Cour constitutionnelle
              </div>
            </div>
          </div>

          <a href="https://www.vd.ch/tribunal-cantonal" target="_blank" rel="noopener noreferrer" className="institution-link">
            Visiter le site du Tribunal cantonal
            <ChevronRight size={18} />
          </a>
        </div>
      </div>

      <div className="institution-section">
        <h2 className="section-title-canton">DÉMOCRATIE DIRECTE</h2>
        <div className="democracy-grid">
          <div className="democracy-card">
            <div className="democracy-icon">✍️</div>
            <h3 className="democracy-name">Initiative populaire</h3>
            <p className="democracy-description">
              12'000 signatures pour proposer une modification de la Constitution cantonale ou une nouvelle loi.
            </p>
          </div>

          <div className="democracy-card">
            <div className="democracy-icon">🗳️</div>
            <h3 className="democracy-name">Référendum obligatoire</h3>
            <p className="democracy-description">
              Modifications constitutionnelles et grandes dépenses soumises automatiquement au vote populaire.
            </p>
          </div>

          <div className="democracy-card">
            <div className="democracy-icon">📝</div>
            <h3 className="democracy-name">Référendum facultatif</h3>
            <p className="democracy-description">
              12'000 signatures dans les 40 jours pour soumettre une loi ou un décret au vote du peuple.
            </p>
          </div>
        </div>
      </div>

      <div className="resources-section">
        <h2 className="section-title-canton">RESSOURCES OFFICIELLES</h2>
        <div className="featured-resource">
          <div className="resource-badge">DOCUMENTATION</div>
          <h3 className="resource-heading">Aide-mémoire communal vaudois</h3>
          <p className="resource-description">
            Direction générale de l'administration et de l'intégration communale (DGAIC)
          </p>
          <p className="resource-text">
            L'aide-mémoire communal constitue une référence essentielle pour les autorités communales 
            vaudoises. Il regroupe les principales dispositions légales et réglementaires applicables 
            aux communes du canton de Vaud.
          </p>
          <a 
            href="https://publication.vd.ch/publications/dgaic/aide-memoire/"
            target="_blank"
            rel="noopener noreferrer"
            className="resource-button"
          >
            CONSULTER L'AIDE-MÉMOIRE
            <ChevronRight size={18} />
          </a>
        </div>

        <div className="links-grid">
          <a href="https://www.vd.ch" target="_blank" rel="noopener noreferrer" className="resource-link-small">
            🏛️ Site officiel du Canton de Vaud
          </a>
          <a href="https://www.vd.ch/constitution" target="_blank" rel="noopener noreferrer" className="resource-link-small">
            📜 Constitution cantonale
          </a>
          <a href="https://www.vd.ch/voter" target="_blank" rel="noopener noreferrer" className="resource-link-small">
            🗳️ Informations sur les votations
          </a>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">DOCUMENTS OFFICIELS (SITE WEB DE LA COMMUNE)</h1>
        <p className="doc-meta">Archives et publications du Conseil communal</p>
      </div>

      <div className="documents-section">
        <h2 className="documents-category">SÉANCES DU CONSEIL COMMUNAL</h2>
        
        <div className="documents-subsection">
          <h3 className="subsection-title">Ordres du jour 2025</h3>
          <div className="documents-list">
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/10/Ordre_du_jour_2025_12_05.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📄</span>
              <span className="doc-name">Ordre du jour - 5 décembre 2025</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/09/Ordre_du_jour_2025_10_07.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📄</span>
              <span className="doc-name">Ordre du jour - 7 octobre 2025</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/08/Ordre_du_jour_2025_09_05.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📄</span>
              <span className="doc-name">Ordre du jour - 5 septembre 2025</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/05/Ordre_du_jour_2025_06_24.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📄</span>
              <span className="doc-name">Ordre du jour - 24 juin 2025</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        <div className="documents-subsection">
          <h3 className="subsection-title">Procès-verbaux 2025</h3>
          <div className="documents-list">
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/12/PV_Conseil_communal_2025_10_07.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📋</span>
              <span className="doc-name">Procès-verbal - 7 octobre 2025</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/10/PV_Conseil_communal_2025_09_05.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📋</span>
              <span className="doc-name">Procès-verbal - 5 septembre 2025</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/09/PV_Conseil_communal_2025_06_24.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📋</span>
              <span className="doc-name">Procès-verbal - 24 juin 2025</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="documents-section">
        <h2 className="documents-category">PRÉAVIS MUNICIPAUX</h2>
        
        <div className="documents-subsection">
          <h3 className="subsection-title">Législature 2025-2026</h3>
          <div className="documents-list">
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/10/Preavis_15_2025_2026_demande_credit_travaux_refection_elargissement_chemin_Sorbiers.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 15 - Crédit chemin des Sorbiers</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/10/Preavis_09_2025_2026_budget-communal-2026.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 09 - Budget communal 2026</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/09/Preavis_08_2025_2026_revision_reglement_patrimoine_arbore.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 08 - Règlement patrimoine arboré</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/09/Preavis_06_2025_2026_credit_renovation_Grande-salle-1.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 06 - Rénovation Grande salle</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/09/Preavis_05_2025_2026_augmentation_plafond_dendettement.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 05 - Plafond d'endettement</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        <div className="documents-subsection">
          <h3 className="subsection-title">Législature 2024-2025</h3>
          <div className="documents-list">
            <a href="https://www.chardonne.ch/wp-content/uploads/2025/05/Preavis_12_2024_2025_gestion_comptes_2024.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 12 - Gestion et comptes 2024</span>
              <ChevronRight size={16} />
            </a>
            <a href="https://www.chardonne.ch/wp-content/uploads/2024/10/Preavis_07_2024_2025_budget_communal_2025.pdf" target="_blank" rel="noopener noreferrer" className="doc-link">
              <span className="doc-icon">📑</span>
              <span className="doc-name">Préavis n° 07 - Budget communal 2025</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="documents-section">
        <h2 className="documents-category">COMPOSITION DU CONSEIL</h2>
        
        <div className="info-panel">
          <h3 className="panel-title">BUREAU DU CONSEIL (2025-2026)</h3>
          <table className="composition-table">
            <tbody>
              <tr>
                <td className="table-key">Président</td>
                <td className="table-val">M. Philippe Durgnat</td>
              </tr>
              <tr>
                <td className="table-key">Premier Vice-président</td>
                <td className="table-val">M. Pascal Décorvet</td>
              </tr>
              <tr>
                <td className="table-key">Deuxième Vice-président</td>
                <td className="table-val">M. Cyril Luyet</td>
              </tr>
              <tr>
                <td className="table-key">Secrétaire</td>
                <td className="table-val">Mme Valérie Schnyder</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-panel">
          <h3 className="panel-title">RÉPARTITION DES SIÈGES</h3>
          <div className="parties-grid">
            <div className="party-card">
              <div className="party-name">PLR Les Libéraux-Radicaux</div>
              <div className="party-seats">17 sièges</div>
            </div>
            <div className="party-card">
              <div className="party-name">Chardonne sans parti</div>
              <div className="party-seats">21 sièges</div>
            </div>
            <div className="party-card">
              <div className="party-name">Groupement des Citoyens Indépendants</div>
              <div className="party-seats">12 sièges</div>
            </div>
          </div>
        </div>

        <div className="external-link-box">
          <a href="https://www.chardonne.ch/conseil-communal/" target="_blank" rel="noopener noreferrer" className="external-link-button">
            VOIR TOUS LES DOCUMENTS SUR CHARDONNE.CH
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );

  const renderRues = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">CARTE & RUES DE CHARDONNE</h1>
        <p className="doc-meta">Plan communal et répertoire des voies</p>
      </div>

      <div className="featured-resource">
        <div className="resource-badge">CARTE OFFICIELLE</div>
        <h3 className="resource-heading">CartoRiviera - Guichet cartographique</h3>
        <p className="resource-description">
          Carte interactive officielle des communes de la Riviera vaudoise
        </p>
        <p className="resource-text">
          CartoRiviera est le guichet cartographique officiel regroupant les données géographiques 
          des communes de la Riviera vaudoise. Accédez à une carte détaillée avec tous les noms de 
          rues, parcelles, bâtiments et infrastructures de Chardonne.
        </p>
        <a 
          href="https://map.cartoriviera.ch/"
          target="_blank"
          rel="noopener noreferrer"
          className="resource-button"
        >
          OUVRIR LA CARTE INTERACTIVE
          <ChevronRight size={18} />
        </a>
      </div>

      <div className="streets-section">
        <h2 className="streets-category">RÉPERTOIRE DES RUES PAR QUARTIER</h2>
        
        <div className="quarter-section">
          <h3 className="quarter-title">🏛️ CHARDONNE CENTRE</h3>
          <div className="streets-grid">
            <a href="https://www.google.com/maps/search/?api=1&query=Rue+du+Village+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Rue du Village</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Rue+de+la+Demi-Lune+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Rue de la Demi-Lune</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Rue+Jacques+Chardonne+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Rue Jacques Chardonne</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Escaliers+du+château+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Escaliers du château</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Vevey+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Vevey</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Lausanne+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Lausanne</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Lavaux+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Lavaux</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+du+Vignoble+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route du Vignoble</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Promenade+du+Château+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Promenade du Château</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Passage+du+Temple+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Passage du Temple</a>
          </div>
        </div>

        <div className="quarter-section">
          <h3 className="quarter-title">⛰️ LE MONT-PÈLERIN</h3>
          <div className="streets-grid">
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Mont-Cheseaux+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Mont-Cheseaux</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Pèlerin+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Pèlerin</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+l'Hôtel+du+Mirador+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de l'Hôtel du Mirador</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+l'Hôtel+du+Parc+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de l'Hôtel du Parc</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Sommet+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Sommet</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Châtel+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Châtel</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Châtel-Saint-Denis+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Châtel-Saint-Denis</a>
          </div>
        </div>

        <div className="quarter-section">
          <h3 className="quarter-title">🏘️ LA MAISON BLANCHE</h3>
          <div className="streets-grid">
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Maison+Jean+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Maison Jean</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+l'Union+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de l'Union</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Paix+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Paix</a>
          </div>
        </div>

        <div className="quarter-section">
          <h3 className="quarter-title">🏡 LA PICHETTE</h3>
          <div className="streets-grid">
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Praz+Valey+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Praz Valey</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Planette+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Planette</a>
          </div>
        </div>

        <div className="quarter-section">
          <h3 className="quarter-title">🌳 AUTRES CHEMINS ET SENTIERS</h3>
          <div className="streets-grid">
            <a href="https://www.google.com/maps/search/?api=1&query=Ancien+sentier+des+Saragines+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Ancien sentier des Saragines</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Bois+de+Ban+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Bois de Ban</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+Champ+de+l'Augeoz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin Champ de l'Augeoz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+d'Ogoz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin d'Ogoz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Bagniège+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Bagniège</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Burignon+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Burignon</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Champ-Pallet+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Champ-Pallet</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Chavonchin+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Chavonchin</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Forchy+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Forchy</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Gort+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Gort</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+l'Ecouralaz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de l'Ecouralaz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+l'Haut-Bozon+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de l'Haut-Bozon</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Baume+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Baume</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Bergère+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Bergère</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Boitaz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Boitaz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Chenalette+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Chenalette</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Cherminche+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Cherminche</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Confrary+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Confrary</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Fin+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Fin</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Forêt+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Forêt</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Gay+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Gay</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Grangette+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Grangette</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Lisière+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Lisière</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Montagne+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Montagne</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Pérose+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Pérose</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+la+Plantaz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de la Plantaz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Mivy+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Mivy</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Panessière+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Panessière</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Paudille+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Paudille</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Paully+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Paully</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Perriaz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Perriaz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Popraz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Popraz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+de+Popraz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin de Popraz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Bedaules+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Bedaules</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Bosquets+de+Paudille+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Bosquets de Paudille</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Combes+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Combes</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Curnilles+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Curnilles</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Essertoux+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Essertoux</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Esserts+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Esserts</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Fornels+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Fornels</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Gottrauces+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Gottrauces</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Jardins+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Jardins</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Pedances+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Pedances</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Pralets+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Pralets</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Roches+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Roches</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Rueyres+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Rueyres</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+des+Sorbiers+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin des Sorbiers</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Bois+Chexbres+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Bois Chexbres</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Bois-de-Ruz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Bois-de-Ruz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Brésil+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Brésil</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Bugnon+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Bugnon</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Chantey+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Chantey</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Dérochoz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Dérochoz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Grammont+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Grammont</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Retet+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Retet</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+du+Rio-Breguet+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin du Rio-Breguet</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chemin+Rouge+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Chemin Rouge</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Côte+au+Bedze+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Côte au Bedze</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Baumaroche+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Baumaroche</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Route+de+Bellevue+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Route de Bellevue</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Sentier+de+Beau-Site+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Sentier de Beau-Site</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Sentier+de+Cremières+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Sentier de Cremières</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Sentier+de+la+Piaz+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Sentier de la Piaz</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Sentier+de+Péroset+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Sentier de Péroset</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Sentier+des+Saragines+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Sentier des Saragines</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Sentier+du+Vieux+Puits+Chardonne" target="_blank" rel="noopener noreferrer" className="street-item">Sentier du Vieux Puits</a>
          </div>
        </div>
      </div>

      <div className="info-panel">
        <h3 className="panel-title">INFORMATIONS</h3>
        <p className="panel-text">
          La commune de Chardonne compte plus de 85 voies publiques réparties entre le village 
          principal et les hameaux du Mont-Pèlerin, La Maison Blanche et La Pichette. Les données 
          proviennent d'OpenStreetMap et sont régulièrement mises à jour.
        </p>
      </div>
    </div>
  );

  const renderCSPPresentation = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">CHARDONNE SANS PARTI</h1>
        <p className="doc-meta">Mouvement politique local — sans étiquette partisane</p>
      </div>

      <div className="section-block">
        <h3 className="section-heading">PRÉSENTATION</h3>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          Chardonne Sans Parti (CSP) est un groupement politique local qui rassemble des citoyennes
          et citoyens engagés pour la commune, sans affiliation à un parti politique national ou cantonal.
          Le mouvement met en avant la proximité, la concertation et la prise de décision pragmatique
          au service des habitants de Chardonne.
        </p>
      </div>

      <div className="section-block">
        <h3 className="section-heading">REPRÉSENTATION ACTUELLE (LÉGISLATURE 2026-2031)</h3>
        <div className="grid-3">
          <div className="info-card">
            <div className="card-label">CONSEIL COMMUNAL</div>
            <div className="card-value">22 / 50 sièges</div>
          </div>
          <div className="info-card">
            <div className="card-label">MUNICIPALITÉ</div>
            <div className="card-value">3 / 5 sièges</div>
          </div>
          <div className="info-card">
            <div className="card-label">FONDATION</div>
            <div className="card-value">Mouvement actif depuis 2016</div>
          </div>
        </div>
      </div>

      <div className="resource-block">
        <h3 className="section-heading">SITE OFFICIEL</h3>
        <a href="https://chardonnesansparti.ch" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">chardonnesansparti.ch</div>
            <div className="resource-meta">Site officiel du mouvement</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://chardonnesansparti.ch/notre-groupement/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Notre groupement</div>
            <div className="resource-meta">Présentation détaillée des valeurs et engagements</div>
          </div>
          <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );

  const renderCSPProgramme = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">PROGRAMME & ÉLECTIONS 2026</h1>
        <p className="doc-meta">Législature 2026-2031</p>
      </div>

      <div className="section-block">
        <h3 className="section-heading">RÉSULTATS DU 1ᵉʳ TOUR — 8 MARS 2026</h3>
        <p style={{ lineHeight: '1.8', color: '#444', marginBottom: '1rem' }}>
          <strong>Conseil communal :</strong> les 22 candidates et candidats du CSP ont été élus, soit
          22 sièges sur 50.
        </p>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          <strong>Municipalité :</strong> Alice Reymond et Catherine Cossy sont élues au premier tour.
          Yannik Vallotton se classe 4ᵉ et passe au second tour.
        </p>
      </div>

      <div className="section-block">
        <h3 className="section-heading">RÉSULTATS DU 2ᵈ TOUR — 29 MARS 2026</h3>
        <p style={{ lineHeight: '1.8', color: '#444' }}>
          Yannik Vallotton est élu à la Municipalité avec plus de 54 % des voix. La nouvelle
          Municipalité pour 2026-2031 est composée de 3 élus CSP (Alice Reymond, Catherine Cossy,
          Yannik Vallotton) et de 2 élus PLR (Yves Genton, Marc Payot).
        </p>
      </div>

      <div className="resource-block">
        <h3 className="section-heading">DOCUMENTS DE CAMPAGNE</h3>
        <a href="https://chardonnesansparti.ch/elections-2026/notre-programme/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Notre programme</div>
            <div className="resource-meta">Programme complet du CSP pour 2026-2031</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://chardonnesansparti.ch/elections-2026/elections-du-8-mars-2026-resultats/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Résultats du 1ᵉʳ tour</div>
            <div className="resource-meta">Détails — 8 mars 2026</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://chardonnesansparti.ch/elections-2026/resultats-du-second-tour-de-lelection-a-la-municipalite-29-mars-2026/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Résultats du 2ᵈ tour</div>
            <div className="resource-meta">Élection à la Municipalité — 29 mars 2026</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://chardonnesansparti.ch/elections-2026/videos/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Vidéos de campagne</div>
            <div className="resource-meta">Présentation des grands axes du programme</div>
          </div>
          <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );

  const renderCSPElus = () => (
    <div className="content-space">
      <div className="doc-header">
        <h1 className="doc-title">ÉLUS & CONTACT</h1>
        <p className="doc-meta">Représentants CSP — Législature 2026-2031</p>
      </div>

      <div className="section-block">
        <h3 className="section-heading">MUNICIPALITÉ (3 SIÈGES SUR 5)</h3>
        <div className="commissions-list">
          <div className="commission-block">
            <div className="commission-header">
              <h3 className="commission-name">Alice Reymond</h3>
              <span className="badge permanente">CSP</span>
            </div>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Élue au 1ᵉʳ tour le 8 mars 2026</p>
          </div>
          <div className="commission-block">
            <div className="commission-header">
              <h3 className="commission-name">Catherine Cossy</h3>
              <span className="badge permanente">CSP</span>
            </div>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Élue au 1ᵉʳ tour le 8 mars 2026</p>
          </div>
          <div className="commission-block">
            <div className="commission-header">
              <h3 className="commission-name">Yannik Vallotton</h3>
              <span className="badge permanente">CSP</span>
            </div>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Élu au 2ᵈ tour le 29 mars 2026 (54 % des voix)</p>
          </div>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-heading">CONSEIL COMMUNAL (22 SIÈGES SUR 50)</h3>
        <p style={{ lineHeight: '1.8', color: '#444', marginBottom: '1rem' }}>
          Les 22 candidates et candidats CSP ont été élus au Conseil communal le 8 mars 2026.
          La liste nominative complète est consultable sur le site officiel.
        </p>
        <a href="https://chardonnesansparti.ch/galerie-avec-description-et-un-bouton/" target="_blank" rel="noopener noreferrer" className="external-link-button">
          Voir la liste des élus
          <ChevronRight size={20} />
        </a>
      </div>

      <div className="resource-block">
        <h3 className="section-heading">CONTACT & RÉSEAUX SOCIAUX</h3>
        <a href="https://chardonnesansparti.ch/contact/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Formulaire de contact</div>
            <div className="resource-meta">Page officielle de contact</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://facebook.com/chardonnesansparti" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Facebook</div>
            <div className="resource-meta">facebook.com/chardonnesansparti</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://instagram.com/chardonnesansparti" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">Instagram</div>
            <div className="resource-meta">@chardonnesansparti</div>
          </div>
          <ChevronRight size={20} />
        </a>
        <a href="https://www.youtube.com/@ChardonneSansParti" target="_blank" rel="noopener noreferrer" className="resource-link">
          <div className="resource-info">
            <div className="resource-title">YouTube</div>
            <div className="resource-meta">Chaîne officielle</div>
          </div>
          <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );

  const renderElections = () => {
    const totalCC = 50;
    const totalMuni = 5;

    const tableStyles = {
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1.5rem',
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        overflow: 'hidden',
      },
      th: {
        background: '#F8FAFC',
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: '#666',
        borderBottom: '1px solid #E5E7EB',
      },
      td: {
        padding: '0.85rem 1rem',
        borderBottom: '1px solid #F1F5F9',
        fontSize: '0.95rem',
        color: '#1A1A1A',
      },
      pastille: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '38px',
        padding: '0.25rem 0.5rem',
        marginRight: '0.6rem',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: 'white',
        borderRadius: '3px',
      },
      muted: {
        color: '#999',
        fontStyle: 'italic',
        fontSize: '0.85rem',
      },
    };

    const partisCC = [
      { code: 'CSP', nom: 'Chardonne Sans Parti (CSP)', sieges: 22, suffrages: 22300, couleur: '#003366', evolution: '+1' },
      { code: 'PLR', nom: 'PLR Chardonne', sieges: 17, suffrages: 17059, couleur: '#1E88E5', evolution: '—' },
      { code: 'GCI', nom: 'Groupement des Citoyens Indépendants (GCI)', sieges: 8, suffrages: 8799, couleur: '#4A7C59', evolution: '—' },
      { code: 'UDC', nom: 'UDC et indépendants', sieges: 3, suffrages: 2775, couleur: '#8B6F47', evolution: '—' },
    ];

    const partisMuni = [
      { code: 'CSP', nom: 'Chardonne Sans Parti', sieges: 3, couleur: '#003366' },
      { code: 'PLR', nom: 'PLR Les Libéraux-Radicaux', sieges: 2, couleur: '#1E88E5' },
    ];

    const elusMuni = [
      { nom: 'Maria Alice Reymond', parti: 'CSP', fonction: 'Syndique', detail: 'Réélue au 1er tour (69.7 %)' },
      { nom: 'Catherine Cossy', parti: 'CSP', fonction: 'Municipale', detail: 'Élue au 1er tour (50.04 %)' },
      { nom: 'Yannik Vallotton', parti: 'CSP', fonction: 'Municipal', detail: 'Élu au 2ᵈ tour (54 %)' },
      { nom: 'Yves Genton', parti: 'PLR', fonction: 'Municipal', detail: 'Élu au 2ᵈ tour' },
      { nom: 'Marc Payot', parti: 'PLR', fonction: 'Municipal', detail: 'Élu au 2ᵈ tour' },
    ];

    const elusCCParParti = [
      {
        code: 'CSP',
        nom: 'Chardonne Sans Parti (22 sièges)',
        couleur: '#003366',
        elus: [
          { nom: 'Rütsche Christin', suffrages: 683 },
          { nom: 'Neyroud Carine', suffrages: 660 },
          { nom: 'Pellé Nathalie', suffrages: 592 },
          { nom: 'Cossy Stöcklin Catherine', suffrages: 566 },
          { nom: 'Marmy Baptiste', suffrages: 557 },
          { nom: 'Vallotton Yannik', suffrages: 552 },
          { nom: 'Cagnard Corinne', suffrages: 552 },
          { nom: 'Décorvet Pascal', suffrages: 551 },
          { nom: 'Dumas Anne-Laure', suffrages: 546 },
          { nom: 'Leveaux Marie', suffrages: 543 },
          { nom: 'Dufey Boris', suffrages: 539 },
          { nom: 'Prêtre Daniel André', suffrages: 508 },
          { nom: 'Havelka Raphaël', suffrages: 495 },
          { nom: 'Lecourt Julien', suffrages: 491 },
          { nom: 'Cegarra Virginie', suffrages: 490 },
          { nom: 'Schimmel Priscilla', suffrages: 489 },
          { nom: 'Althaus Fabien', suffrages: 488 },
          { nom: 'Burdet Liliane', suffrages: 485 },
          { nom: 'Aiello Graziella', suffrages: 477 },
          { nom: 'Maisières Fabrice', suffrages: 467 },
          { nom: 'Lange Fabrice', suffrages: 459 },
          { nom: 'Attinost David', suffrages: 457 },
        ],
        sourceUrl: 'https://chardonnesansparti.ch/galerie-avec-description-et-un-bouton/',
        sourceLabel: 'Voir la galerie CSP',
      },
      {
        code: 'PLR',
        nom: 'PLR Chardonne (17 sièges)',
        couleur: '#1E88E5',
        elus: [
          { nom: 'Morel Delphine', suffrages: 590 },
          { nom: 'Mouron Jean-Philippe', suffrages: 574 },
          { nom: 'Ducret Anne', suffrages: 536 },
          { nom: 'Duriaux Gilles', suffrages: 504 },
          { nom: 'Payot Marc', suffrages: 492 },
          { nom: 'Troxler Simone', suffrages: 459 },
          { nom: 'Fort Mélanie', suffrages: 429 },
          { nom: 'Desreumaux Philippe', suffrages: 429 },
          { nom: 'Neyroud Valentin', suffrages: 415 },
          { nom: 'Gilliéron Romain', suffrages: 413 },
          { nom: 'Jordan Caroline', suffrages: 411 },
          { nom: 'Michel Laurent', suffrages: 396 },
          { nom: 'Oechslin Daniel', suffrages: 396 },
          { nom: 'Luyet Cyril', suffrages: 387 },
          { nom: 'Monnier Nicole', suffrages: 381 },
          { nom: 'Ducret Francine', suffrages: 372 },
          { nom: 'Girod Maxime', suffrages: 371 },
        ],
        sourceUrl: 'https://www.plr-chardonne.ch/personnes/conseil-communal',
        sourceLabel: 'Site PLR Chardonne',
      },
      {
        code: 'GCI',
        nom: 'Groupement des Citoyens Indépendants (8 sièges)',
        couleur: '#4A7C59',
        elus: [
          { nom: 'Verdan Philippe', suffrages: 509 },
          { nom: 'Pelot Jean-David', suffrages: 355 },
          { nom: 'Chappuis Céline', suffrages: 334 },
          { nom: 'Marclay Catherine', suffrages: 326 },
          { nom: 'Wernli Heinz', suffrages: 291 },
          { nom: 'Johnston Christine', suffrages: 287 },
          { nom: 'Hierholtz Ladislas', suffrages: 268 },
          { nom: 'Mercier Philippe', suffrages: 258 },
        ],
        sourceUrl: 'https://www.gcichardonne.ch/viennent-ensuite-fr510.html',
        sourceLabel: 'Site GCI Chardonne',
      },
      {
        code: 'UDC',
        nom: 'UDC et indépendants (3 sièges)',
        couleur: '#8B6F47',
        elus: [
          { nom: 'Cavin Virgile', suffrages: 104 },
          { nom: 'Ducret Kevin', suffrages: 100 },
          { nom: 'Ciocca Alain', suffrages: 82 },
        ],
        sourceUrl: null,
        sourceLabel: null,
      },
    ];

    const SeatBar = ({ items, total }) => (
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', height: '28px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
          {items.map((p) => (
            <div
              key={p.code}
              title={`${p.nom} — ${p.sieges} sièges`}
              style={{
                flex: p.sieges,
                background: p.couleur,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {p.sieges >= 3 ? `${p.code} · ${p.sieges}` : p.sieges}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.4rem', textAlign: 'right' }}>
          Total : {total} sièges
        </div>
      </div>
    );

    return (
      <div className="content-space" style={{ maxWidth: '1100px' }}>
        <div className="doc-header">
          <h1 className="doc-title">ÉLECTIONS COMMUNALES 2026</h1>
          <p className="doc-meta">Résultats — Législature 2026-2031</p>
        </div>

        <div className="section-block">
          <h3 className="section-heading">CONSEIL COMMUNAL ({totalCC} SIÈGES)</h3>
          <SeatBar items={partisCC} total={totalCC} />

          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Parti</th>
                <th style={{ ...tableStyles.th, textAlign: 'right' }}>Sièges</th>
                <th style={{ ...tableStyles.th, textAlign: 'right' }}>Part</th>
                <th style={{ ...tableStyles.th, textAlign: 'right' }}>Suffrages</th>
                <th style={{ ...tableStyles.th, textAlign: 'center' }}>Évolution</th>
              </tr>
            </thead>
            <tbody>
              {partisCC.map((p) => (
                <tr key={p.code}>
                  <td style={tableStyles.td}>
                    <span style={{ ...tableStyles.pastille, background: p.couleur }}>{p.code}</span>
                    {p.nom}
                  </td>
                  <td style={{ ...tableStyles.td, textAlign: 'right', fontWeight: 700 }}>{p.sieges}</td>
                  <td style={{ ...tableStyles.td, textAlign: 'right' }}>
                    {Math.round((p.sieges / totalCC) * 100)} %
                  </td>
                  <td style={{ ...tableStyles.td, textAlign: 'right', color: '#666', fontSize: '0.85rem' }}>
                    {p.suffrages.toLocaleString('fr-CH')}
                  </td>
                  <td style={{ ...tableStyles.td, textAlign: 'center' }}>{p.evolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-block">
          <h3 className="section-heading">MUNICIPALITÉ ({totalMuni} SIÈGES)</h3>
          <SeatBar items={partisMuni} total={totalMuni} />

          <div className="commissions-list" style={{ marginTop: '1.5rem' }}>
            {elusMuni.map((e) => (
              <div key={e.nom} className="commission-block">
                <div className="commission-header">
                  <h3 className="commission-name">{e.nom}</h3>
                  <span className="badge permanente">{e.parti}</span>
                </div>
                <p style={{ color: '#444', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  <strong>{e.fonction}</strong>
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{e.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-block">
          <h3 className="section-heading">CONSEIL COMMUNAL — ÉLUS PAR PARTI</h3>
          {elusCCParParti.map((g) => (
            <div
              key={g.code}
              style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ ...tableStyles.pastille, background: g.couleur, fontSize: '0.85rem', padding: '0.3rem 0.7rem' }}>{g.code}</span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{g.nom}</h4>
              </div>

              {g.elus.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '0.4rem 1.25rem',
                  fontSize: '0.9rem',
                }}>
                  {g.elus.map((e, idx) => (
                    <div
                      key={e.nom}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        padding: '0.25rem 0',
                        borderBottom: '1px dotted #E5E7EB',
                      }}
                    >
                      <span style={{ color: '#1A1A1A' }}>
                        <span style={{ color: '#999', fontSize: '0.75rem', marginRight: '0.4rem' }}>
                          {idx + 1}.
                        </span>
                        {e.nom}
                      </span>
                      <span style={{ color: '#666', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        {e.suffrages.toLocaleString('fr-CH')} suffr.
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Liste nominative non encore renseignée.
                </p>
              )}

              {g.sourceUrl && (
                <a
                  href={g.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    marginTop: '1rem',
                    color: '#003366',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {g.sourceLabel}
                  <ChevronRight size={16} />
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="info-panel">
          <h3 className="panel-title">SOURCE OFFICIELLE</h3>
          <p className="panel-text">
            Les résultats nominatifs et la répartition des sièges proviennent du site officiel
            des élections du Canton de Vaud (elections.vd.ch). La composition de la Municipalité
            a été confirmée à l'issue du 2ᵈ tour du 29 mars 2026.
          </p>
          <a
            href="https://www.elections.vd.ch/votelec/app23/index.html?id=CORP20260308"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.75rem',
              color: '#003366',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Résultats détaillés sur elections.vd.ch <ChevronRight size={18} />
          </a>
        </div>
      </div>
    );
  };

  const renderMedias = () => {
    const mediasData = {
      regional: {
        titre: 'PRESSE RÉGIONALE — VAUD & RIVIERA',
        items: [
          { name: '24 heures', desc: 'Quotidien vaudois — référence cantonale', url: 'https://www.24heures.ch' },
          { name: 'Riviera Chablais', desc: 'Bi-hebdomadaire de la Riviera et du Chablais', url: 'https://www.riviera-chablais.ch' },
          { name: 'Le Régional', desc: 'Hebdomadaire gratuit Riviera-Chablais-Lavaux', url: 'https://www.leregional.ch' },
          { name: 'La Télé', desc: 'Télévision régionale Vaud–Fribourg', url: 'https://www.latele.ch' },
        ],
      },
      romand: {
        titre: 'PRESSE ROMANDE',
        items: [
          { name: 'Le Temps', desc: 'Quotidien de référence en Suisse romande', url: 'https://www.letemps.ch' },
          { name: 'Le Courrier', desc: 'Quotidien indépendant romand', url: 'https://www.lecourrier.ch' },
          { name: 'Tribune de Genève', desc: 'Quotidien genevois', url: 'https://www.tdg.ch' },
          { name: 'Heidi.news', desc: 'Média numérique romand indépendant', url: 'https://www.heidi.news' },
          { name: "L'Illustré", desc: 'Magazine hebdomadaire romand', url: 'https://www.illustre.ch' },
          { name: 'Watson', desc: 'Média numérique généraliste suisse', url: 'https://www.watson.ch/fr' },
        ],
      },
      audiovisuel: {
        titre: 'RADIO & TÉLÉVISION',
        items: [
          { name: 'RTS Info', desc: 'Actualités radio-télévision suisse romande', url: 'https://www.rts.ch/info/' },
          { name: 'RTS La 1ère', desc: 'Première chaîne radio romande', url: 'https://www.rts.ch/la-1ere/' },
          { name: 'Léman Bleu', desc: 'Télévision lémanique', url: 'https://www.lemanbleu.ch' },
          { name: 'Swissinfo', desc: 'Actualité suisse en plusieurs langues', url: 'https://www.swissinfo.ch/fre' },
        ],
      },
    };

    return (
      <div className="content-space">
        <div className="doc-header">
          <h1 className="doc-title">PRESSE & MÉDIAS</h1>
          <p className="doc-meta">Sélection des principaux médias romands et régionaux</p>
        </div>

        {Object.values(mediasData).map((section) => (
          <div className="resource-block" key={section.titre}>
            <h3 className="section-heading">{section.titre}</h3>
            {section.items.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <div className="resource-info">
                  <div className="resource-title">{item.name}</div>
                  <div className="resource-meta">{item.desc}</div>
                </div>
                <ChevronRight size={20} />
              </a>
            ))}
          </div>
        ))}

        <div className="info-panel">
          <h3 className="panel-title">À PROPOS DE CETTE SÉLECTION</h3>
          <p className="panel-text">
            Cette liste rassemble les médias suisses romands utiles pour suivre l'actualité
            locale, cantonale et nationale. Elle n'est pas exhaustive — n'hésitez pas à
            signaler un titre manquant pour qu'il soit ajouté.
          </p>
        </div>
      </div>
    );
  };

  const renderVotations = () => {
    const { votations, miseAJour, demo } = votationsData;

    const niveauBadge = {
      federal: { label: 'FÉDÉRAL', bg: '#E8F0F8', color: '#003366' },
      cantonal: { label: 'CANTONAL', bg: '#E3F1EA', color: '#2A6B4F' },
    };

    const VotationCard = ({ objet }) => {
      const badge = niveauBadge[objet.niveau] || niveauBadge.federal;
      const ref = objet.reference;
      const oui = Math.max(0, Math.min(100, ref.oui));
      const non = 100 - oui;
      return (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ marginBottom: '0.6rem' }}>
            <span style={{ background: badge.bg, color: badge.color, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '20px', letterSpacing: '0.5px' }}>
              {badge.label}
            </span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#003366', marginBottom: '0.3rem' }}>{objet.titre}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: ref.accepte ? '#2A6B4F' : '#B5483D', marginBottom: '0.9rem' }}>
            {ref.accepte ? 'Accepté' : 'Refusé'} — {ref.lieu}
          </div>

          <div style={{ display: 'flex', height: '30px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E0E0E0', marginBottom: '0.25rem' }}>
            <div style={{ width: `${oui}%`, background: '#3B7A57', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
              {oui >= 18 ? `Oui ${Math.round(oui)}%` : ''}
            </div>
            <div style={{ width: `${non}%`, background: '#C25B4F', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
              {non >= 18 ? `Non ${Math.round(non)}%` : ''}
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9AA7B4', textAlign: 'right', marginBottom: '0.9rem' }}>Résultat {ref.lieu}</div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${objet.lieux.length}, minmax(0, 1fr))`, gap: '0.6rem' }}>
            {objet.lieux.map((lieu) => {
              const focus = lieu.cle === 'chardonne';
              return (
                <div key={lieu.cle} style={{ background: focus ? '#E8F0F8' : 'white', border: focus ? '2px solid #003366' : '1px solid #D8E0E8', borderRadius: '8px', padding: '0.6rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: focus ? '#003366' : '#5A6B7C', marginBottom: '0.15rem' }}>{lieu.nom}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: focus ? '#003366' : '#33444F' }}>{Math.round(lieu.oui)}%</div>
                  <div style={{ fontSize: '0.72rem', color: lieu.accepte ? '#2A6B4F' : '#B5483D' }}>oui · {lieu.accepte ? 'Accepté' : 'Refusé'}</div>
                  {lieu.participation != null && (
                    <div style={{ fontSize: '0.68rem', color: '#9AA7B4', marginTop: '0.2rem' }}>Particip. {Math.round(lieu.participation)}%</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="content-space" style={{ maxWidth: '1100px' }}>
        <div className="doc-header">
          <h1 className="doc-title">VOTATIONS</h1>
          <p className="doc-meta">Fédérales et cantonales — résultats avec focus sur Chardonne</p>
        </div>

        {demo && (
          <div style={{ background: '#FAEEDA', border: '1px solid #EFC77A', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#7A5A12', marginBottom: '1.5rem' }}>
            Données d'illustration — lancez le script de mise à jour pour afficher les résultats officiels.
          </div>
        )}

        {(!votations || votations.length === 0) && (
          <div className="section-block">
            <p style={{ color: '#666' }}>Aucune votation enregistrée pour le moment.</p>
          </div>
        )}

        {votations && votations.map((v) => (
          <div className="section-block" key={v.date}>
            <h3 className="section-heading">{v.dateLabel}</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {v.objets.map((objet, i) => (
                <VotationCard key={i} objet={objet} />
              ))}
            </div>
          </div>
        ))}

        <div className="info-panel">
          <h3 className="panel-title">SOURCE DES DONNÉES</h3>
          <p className="panel-text">
            Résultats issus de l'open data officiel VoteInfo (Confédération / Office fédéral de la statistique).
            Le résultat de Chardonne (n° OFS 5882) est comparé à celui du canton de Vaud et de la Suisse.
            {miseAJour ? ` Dernière mise à jour des données : ${miseAJour}.` : ''}
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'accueil': return renderAccueil();
      case 'cantonal': return renderCantonal();
      case 'district': return renderDistrict();
      case 'communal': return renderCommunal();
      case 'commissions': return renderCommissions();
      case 'documents': return renderDocuments();
      case 'rues': return renderRues();
      case 'elections': return renderElections();
      case 'csp-presentation': return renderCSPPresentation();
      case 'csp-programme': return renderCSPProgramme();
      case 'csp-elus': return renderCSPElus();
      case 'votations': return renderVotations();
      case 'medias': return renderMedias();
      default: return renderAccueil();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <button
              className="sidebar-toggle-btn"
              onClick={() => setSidebarHidden(!sidebarHidden)}
              title={sidebarHidden ? "Afficher le menu" : "Masquer le menu"}
              aria-label={sidebarHidden ? "Afficher le menu" : "Masquer le menu"}
            >
              {sidebarHidden ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
            </button>
            <div className="flags-container">
              <a 
                href="https://fr.wikipedia.org/wiki/Drapeau_et_armoiries_de_la_Suisse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flag flag-suisse" 
                title="Confédération suisse"
              >
                <img src={LOGO_SUISSE} alt="Drapeau suisse" />
              </a>
              <a 
                href="https://fr.wikipedia.org/wiki/Drapeau_et_armoiries_du_canton_de_Vaud" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flag flag-vaud" 
                title="Canton de Vaud - Liberté et Patrie"
              >
                <img src={LOGO_VAUD} alt="Armoiries du Canton de Vaud" />
              </a>
              <a 
                href="https://www.faovd.ch/alphabet-des-communes/214/chardonne/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flag flag-chardonne" 
                title="Commune de Chardonne - Trois chardons et deux chardonnerets"
              >
                <img src={LOGO_CHARDONNE} alt="Armoiries de Chardonne" />
              </a>
            </div>
            <div className="logo-text">
              <span className="logo-main">MÉMO DU CONSEILLER COMMUNAL</span>
              <span className="logo-sub">Chardonne · Ressources et règlements</span>
            </div>
          </div>
          <div className="header-info">
            <div className="date-time">
              <div className="date-display">
                {dateTime.toLocaleDateString('fr-CH', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="time-display">
                {dateTime.toLocaleTimeString('fr-CH', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="weather-display">
              <span className="weather-icon">☀️</span>
              <span className="weather-temp">10.5°C</span>
              <span className="weather-condition">Ensoleillé</span>
            </div>
          </div>
          <button className="menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''} ${sidebarHidden ? 'hidden' : ''}`}>
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const showCategoryHeader = item.category && (index === 0 || navigation[index - 1].category !== item.category);
            
            return (
              <React.Fragment key={item.id}>
                {showCategoryHeader && (
                  <div className="sidebar-category">{item.category}</div>
                )}
                <button
                  onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                  className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </aside>

        <main className="main">{renderContent()}</main>
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app {
          min-height: 100vh;
          background: #F5F5F5;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #1A1A1A;
        }

        .header {
          background: #003366;
          color: white;
          border-bottom: 3px solid #002244;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .flags-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-right: 0.5rem;
        }

        .flag {
          width: 56px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          text-decoration: none;
        }

        .flag:hover {
          transform: scale(1.1);
        }

        .flag-suisse {
          background: white;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flag-suisse img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .flag-vaud {
          background: white;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flag-vaud img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .flag-chardonne {
          background: white;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flag-chardonne img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .chardonne-emblem {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .chardonne-emblem::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30%;
          background: #4A7C59;
          border-radius: 50% 50% 0 0;
        }

        .chardonne-emblem::after {
          content: '🌺';
          position: relative;
          font-size: 22px;
          z-index: 1;
          margin-bottom: 2px;
          filter: hue-rotate(270deg) saturate(1.5);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-main {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .logo-sub {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          opacity: 0.8;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .date-time {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .date-display {
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .time-display {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .weather-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        .weather-icon {
          font-size: 1.5rem;
        }

        .weather-temp {
          font-size: 1rem;
          font-weight: 700;
        }

        .weather-condition {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .sidebar-toggle-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          margin-right: 0.5rem;
          opacity: 0.85;
          transition: opacity 0.15s, background 0.15s;
        }

        .sidebar-toggle-btn:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .layout {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          min-height: calc(100vh - 70px);
        }

        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #D0D0D0;
          padding: 1.5rem 0;
        }

        .sidebar.hidden {
          display: none;
        }

        .sidebar-category {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #003366;
          padding: 1.5rem 1.5rem 0.75rem 1.5rem;
          margin-top: 1rem;
          border-top: 1px solid #E8E8E8;
        }

        .sidebar-category:first-child {
          margin-top: 0;
          border-top: none;
        }

        .sidebar-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1A1A1A;
          text-align: left;
          transition: all 0.15s;
          border-left: 3px solid transparent;
          position: relative;
        }

        .sidebar-item svg {
          flex-shrink: 0;
          color: #666;
          transition: color 0.15s;
        }

        .sidebar-item:hover {
          background: #F5F5F5;
        }

        .sidebar-item:hover svg {
          color: #003366;
        }

        .sidebar-item.active {
          background: #E8F0F8;
          border-left-color: #003366;
          color: #003366;
          font-weight: 600;
        }

        .sidebar-item.active svg {
          color: #003366;
        }
          color: #003366;
        }

        .main {
          flex: 1;
          padding: 3rem;
        }

        .content-space {
          max-width: 900px;
        }

        /* Accueil */
        .header-block {
          text-align: center;
          padding: 3rem 0 4rem 0;
          border-bottom: 2px solid #D0D0D0;
          margin-bottom: 3rem;
        }

        .swiss-cross {
          font-size: 3rem;
          color: #003366;
          font-weight: 300;
          margin-bottom: 1rem;
        }

        .main-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #003366;
          margin-bottom: 0.5rem;
        }

        .sub-title {
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .divider {
          width: 60px;
          height: 2px;
          background: #003366;
          margin: 1.5rem auto;
        }

        .intro-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #444;
          max-width: 600px;
          margin: 0 auto;
        }

        .section-block {
          margin-bottom: 3rem;
        }

        .section-heading {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #003366;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #D0D0D0;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          border: 1px solid #D0D0D0;
          padding: 1.5rem;
          text-align: center;
        }

        .card-label {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .card-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #003366;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2rem 1rem;
          background: white;
          border: 2px solid #D0D0D0;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          color: #003366;
          transition: all 0.15s;
        }

        .nav-button:hover {
          border-color: #003366;
          background: #F5F5F5;
        }

        .resource-block {
          margin-bottom: 3rem;
        }

        .resource-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border: 2px solid #003366;
          text-decoration: none;
          color: inherit;
          transition: all 0.15s;
        }

        .resource-link:hover {
          background: #003366;
          color: white;
        }

        .resource-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .resource-meta {
          font-size: 0.8125rem;
          color: #666;
        }

        .resource-link:hover .resource-meta {
          color: rgba(255,255,255,0.8);
        }

        /* Documents */
        .doc-header {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #D0D0D0;
        }

        .doc-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #003366;
          margin-bottom: 0.5rem;
        }

        .doc-meta {
          font-size: 0.875rem;
          color: #666;
          font-style: italic;
        }

        /* PDF Actions */
        .pdf-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #D0D0D0;
        }

        .pdf-button {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.875rem 1.5rem;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.15s;
          border: 2px solid #003366;
        }

        .pdf-button.download {
          background: #003366;
          color: white;
        }

        .pdf-button.download:hover {
          background: #002244;
          border-color: #002244;
        }

        .pdf-button.view {
          background: white;
          color: #003366;
        }

        .pdf-button.view:hover {
          background: #F5F5F5;
        }

        .pdf-icon {
          font-size: 1.125rem;
        }

        .reglement-content {
          background: white;
          border: 1px solid #D0D0D0;
        }

        .section-wrapper {
          border-bottom: 1px solid #D0D0D0;
        }

        .section-wrapper:last-child {
          border-bottom: none;
        }

        .titre-section {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #003366;
          padding: 1.5rem 2rem;
          background: #F5F5F5;
          margin: 0;
        }

        .chapitre-wrapper {
          border-bottom: 1px solid #E8E8E8;
        }

        .chapitre-wrapper:last-child {
          border-bottom: none;
        }

        .chapitre-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
        }

        .chapitre-toggle:hover {
          background: #FAFAFA;
        }

        .chapitre-info {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .chapitre-num {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #003366;
        }

        .chapitre-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1A1A1A;
        }

        .toggle-icon {
          flex-shrink: 0;
          color: #999;
          transition: transform 0.2s;
        }

        .toggle-icon.expanded {
          transform: rotate(90deg);
        }

        .articles-container {
          padding: 0 2rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .article-box {
          padding: 1.5rem;
          background: #FAFAFA;
          border-left: 3px solid #003366;
        }

        .article-num {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #003366;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .article-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 0.75rem;
        }

        .article-text {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #444;
          white-space: pre-line;
        }

        /* Commissions */
        .commissions-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .commission-block {
          background: white;
          border: 1px solid #D0D0D0;
          padding: 2rem;
        }

        .commission-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #F5F5F5;
        }

        .commission-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #003366;
          letter-spacing: 0.02em;
        }

        .badge {
          padding: 0.375rem 0.875rem;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 2px;
        }

        .badge.permanente {
          background: #E8F0F8;
          color: #003366;
        }

        .badge.temporaire {
          background: #FFF3E0;
          color: #B8860B;
        }

        .commission-table {
          width: 100%;
          border-collapse: collapse;
        }

        .commission-table tr {
          border-bottom: 1px solid #F0F0F0;
        }

        .commission-table tr:last-child {
          border-bottom: none;
        }

        .table-key {
          padding: 0.75rem 0;
          font-weight: 600;
          font-size: 0.875rem;
          color: #666;
          width: 30%;
        }

        .table-val {
          padding: 0.75rem 0;
          font-size: 0.9375rem;
          color: #1A1A1A;
        }

        /* Cantonal */
        .featured-resource {
          background: white;
          border: 2px solid #003366;
          padding: 2.5rem;
          margin-bottom: 3rem;
        }

        .resource-badge {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: #003366;
          color: white;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }

        .resource-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: #003366;
          margin-bottom: 0.75rem;
        }

        .resource-description {
          font-size: 0.875rem;
          color: #666;
          font-style: italic;
          margin-bottom: 1.5rem;
        }

        .resource-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 2rem;
        }

        .resource-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #003366;
          color: white;
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition: all 0.15s;
        }

        .resource-button:hover {
          background: #002244;
        }

        .info-panel {
          background: white;
          border: 1px solid #D0D0D0;
          padding: 2rem;
        }

        .panel-title {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #003366;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #F5F5F5;
        }

        .panel-text {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #444;
        }

        .principles-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .principles-list li {
          padding-left: 1.5rem;
          position: relative;
          font-size: 0.9375rem;
          color: #444;
          line-height: 1.6;
        }

        .principles-list li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #003366;
          font-weight: bold;
          font-size: 1.25rem;
        }

        /* Documents officiels */
        .documents-section {
          margin-bottom: 3rem;
        }

        .documents-category {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #003366;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #D0D0D0;
        }

        .documents-subsection {
          margin-bottom: 2rem;
        }

        .subsection-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: white;
          border: 1px solid #D0D0D0;
          padding: 0.5rem;
        }

        .doc-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          text-decoration: none;
          color: #1A1A1A;
          transition: all 0.15s;
          border-left: 3px solid transparent;
        }

        .doc-link:hover {
          background: #F5F5F5;
          border-left-color: #003366;
        }

        .doc-icon {
          font-size: 1.125rem;
          flex-shrink: 0;
        }

        .doc-name {
          flex: 1;
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .composition-table {
          width: 100%;
          border-collapse: collapse;
        }

        .composition-table tr {
          border-bottom: 1px solid #F0F0F0;
        }

        .composition-table tr:last-child {
          border-bottom: none;
        }

        .parties-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .party-card {
          text-align: center;
          padding: 1.5rem 1rem;
          background: #F5F5F5;
          border: 1px solid #D0D0D0;
        }

        .party-name {
          font-size: 0.8125rem;
          color: #666;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .party-seats {
          font-size: 1.5rem;
          font-weight: 700;
          color: #003366;
        }

        .external-link-box {
          margin-top: 2rem;
        }

        .external-link-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #003366;
          color: white;
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition: all 0.15s;
        }

        .external-link-button:hover {
          background: #002244;
        }

        /* Carte & Rues */
        .streets-section {
          margin-top: 3rem;
        }

        .streets-category {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #003366;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #D0D0D0;
        }

        .quarter-section {
          margin-bottom: 3rem;
        }

        .quarter-title {
          font-size: 1rem;
          font-weight: 600;
          color: #003366;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #F0F0F0;
        }

        .streets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .street-item {
          display: block;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #D0D0D0;
          font-size: 0.875rem;
          color: #1A1A1A;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
        }

        .street-item:hover {
          background: #F5F5F5;
          border-color: #003366;
          color: #003366;
        }

        /* Canton de Vaud - Organisation politique */
        .intro-panel {
          background: #E8F0F8;
          border-left: 4px solid #003366;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .intro-text-canton {
          font-size: 1rem;
          line-height: 1.7;
          color: #1A1A1A;
          margin: 0;
        }

        .powers-section {
          margin-bottom: 3rem;
        }

        .section-title-canton {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #003366;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #D0D0D0;
        }

        .section-intro {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #444;
          margin-bottom: 2rem;
        }

        .powers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .power-card {
          background: white;
          border: 2px solid #D0D0D0;
          padding: 2rem;
          text-align: center;
          transition: all 0.2s;
        }

        .power-card:hover {
          border-color: #003366;
          box-shadow: 0 4px 12px rgba(0,51,102,0.1);
        }

        .power-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .power-name {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #666;
          margin-bottom: 0.75rem;
        }

        .power-institution {
          font-size: 1.25rem;
          font-weight: 600;
          color: #003366;
          margin-bottom: 1rem;
        }

        .power-description {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: #444;
        }

        .institution-section {
          margin-bottom: 3rem;
        }

        .institution-card {
          background: white;
          border: 1px solid #D0D0D0;
          padding: 2.5rem;
        }

        .institution-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #F5F5F5;
        }

        .institution-icon-large {
          font-size: 3.5rem;
        }

        .institution-intro {
          flex: 1;
        }

        .institution-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #003366;
          margin-bottom: 0.5rem;
        }

        .institution-subtitle {
          font-size: 0.9375rem;
          color: #666;
          font-style: italic;
        }

        .institution-details {
          margin-bottom: 2rem;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1.5rem;
          padding: 1rem 0;
          border-bottom: 1px solid #F0F0F0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 600;
          font-size: 0.875rem;
          color: #666;
        }

        .detail-value {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #1A1A1A;
        }

        .departments-section {
          background: #F5F5F5;
          padding: 2rem;
          margin: 2rem 0;
        }

        .departments-title {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #003366;
          margin-bottom: 1.5rem;
        }

        .departments-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .department-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border: 1px solid #D0D0D0;
          font-size: 0.875rem;
        }

        .dept-icon {
          font-size: 1.5rem;
        }

        .dept-name {
          font-weight: 500;
          color: #1A1A1A;
        }

        .institution-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #003366;
          color: white;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.15s;
          margin-top: 1rem;
        }

        .institution-link:hover {
          background: #002244;
        }

        .democracy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .democracy-card {
          background: white;
          border: 1px solid #D0D0D0;
          padding: 2rem;
          text-align: center;
        }

        .democracy-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .democracy-name {
          font-size: 1rem;
          font-weight: 600;
          color: #003366;
          margin-bottom: 1rem;
        }

        .democracy-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #444;
        }

        .resources-section {
          margin-top: 4rem;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        .resource-link-small {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          background: white;
          border: 1px solid #D0D0D0;
          color: #003366;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s;
        }

        .resource-link-small:hover {
          background: #F5F5F5;
          border-color: #003366;
        }

        /* District */
        .prefets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .prefet-card {
          background: #F5F5F5;
          padding: 2rem;
          border: 1px solid #D0D0D0;
        }

        .prefet-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #003366;
          margin-bottom: 0.5rem;
        }

        .prefet-role {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .prefet-description {
          font-size: 0.875rem;
          line-height: 1.7;
          color: #444;
        }

        .prefet-highlight {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: #E8F0F8;
          border-left: 3px solid #003366;
          font-size: 0.875rem;
          font-weight: 600;
          color: #003366;
        }

        .detail-section-title {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #003366;
          margin: 2rem 0 1.5rem 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          background: white;
          border: 1px solid #D0D0D0;
          padding: 2rem;
          text-align: center;
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #003366;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #666;
          font-weight: 500;
        }

        .communes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .commune-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: white;
          border: 1px solid #D0D0D0;
          font-size: 0.9375rem;
          font-weight: 500;
          text-decoration: none;
          color: #1A1A1A;
          transition: all 0.15s;
        }

        .commune-item:hover {
          background: #F5F5F5;
          border-color: #003366;
        }

        .commune-highlight {
          background: #E8F0F8;
          border-color: #003366;
        }

        .commune-icon {
          font-size: 1.5rem;
        }

        .commune-name {
          flex: 1;
          color: #1A1A1A;
        }

        .commune-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: #003366;
          color: white;
          border-radius: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .districts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .district-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #D0D0D0;
          text-decoration: none;
          transition: all 0.15s;
        }

        .district-item:hover {
          background: #F5F5F5;
          border-color: #003366;
        }

        .district-highlight {
          background: #E8F0F8;
          border-color: #003366;
        }

        .district-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .district-name {
          font-size: 1rem;
          font-weight: 600;
          color: #003366;
          margin-bottom: 0.25rem;
        }

        .district-meta {
          font-size: 0.875rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .menu-btn { display: block; }
          .sidebar-toggle-btn { display: none; }
          .header-info { display: none; }
          .sidebar {
            position: fixed;
            left: -100%;
            top: 70px;
            height: calc(100vh - 70px);
            z-index: 100;
            transition: left 0.3s;
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
          }
          .sidebar.open { left: 0; }
          .main { padding: 1.5rem; }
          .header-block { padding: 2rem 0 3rem 0; }
          .main-title { font-size: 1.5rem; }
          .sub-title { font-size: 1rem; }
          .grid-3 { grid-template-columns: 1fr; }
          .nav-grid { grid-template-columns: 1fr; }
          .doc-title { font-size: 1.5rem; }
          .parties-grid { grid-template-columns: 1fr; }
          .streets-grid { grid-template-columns: 1fr; }
          .powers-grid { grid-template-columns: 1fr; }
          .democracy-grid { grid-template-columns: 1fr; }
          .departments-grid { grid-template-columns: 1fr; }
          .links-grid { grid-template-columns: 1fr; }
          .detail-row { grid-template-columns: 1fr; gap: 0.5rem; }
          .prefets-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .communes-grid { grid-template-columns: 1fr; }
          .districts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default App;