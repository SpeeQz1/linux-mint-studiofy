import { useState } from 'react';
import styles from './App.module.scss';

interface Category {
  id: string;
  title: string;
}

interface Section {
  id: string;
  categoryId: string;
  title: string;
}

interface Application {
  id: string;
  name: string;
  categoryId: string;
  sectionId: string;
  formats?: string[];
  isInstalled?: boolean;
}

const App = () => {
  const [categories] = useState<Category[]>([
    { id: '3d-design', title: '3D DESIGN' },
    { id: 'video-editing', title: 'Video Editing' },
    { id: 'utilities', title: 'Utilities' },
    { id: 'drawing', title: 'Drawing' },
    { id: 'engineering', title: 'Engineering' },
    { id: 'animation', title: 'Animation' },
    { id: 'rendering', title: 'Rendering' },
    { id: 'texturing', title: 'Texturing' },
    { id: 'modeling', title: 'Modeling' },
    { id: 'rigging', title: 'Rigging' }
  ]);

  const [sections] = useState<Section[]>([
    { id: 'mesh-modeling', categoryId: '3d-design', title: 'Mesh Modeling' },
    { id: 'sculpting', categoryId: '3d-design', title: 'Sculpting' },
    { id: 'video-tools', categoryId: 'video-editing', title: 'Video Tools' },
    { id: 'animation-tools', categoryId: 'animation', title: 'Animation Tools' }
  ]);

  const [applications] = useState<Application[]>([
    { 
      id: 'meshlab-1', 
      name: 'MeshLab', 
      categoryId: '3d-design',
      sectionId: 'mesh-modeling',
      formats: ['deb', 'flatpakref', 'AppImage'] 
    },
    { 
      id: 'meshlab-2', 
      name: 'MeshLab 2', 
      categoryId: '3d-design',
      sectionId: 'mesh-modeling',
      formats: ['deb', 'flatpakref', 'AppImage'] 
    },
    { 
      id: 'zbrush', 
      name: 'ZBrush',
      categoryId: '3d-design',
      sectionId: 'sculpting'
    },
    { 
      id: 'maya', 
      name: 'Maya',
      categoryId: '3d-design',
      sectionId: 'sculpting'
    },
    { 
      id: 'blender', 
      name: 'Blender',
      categoryId: '3d-design',
      sectionId: 'sculpting',
      formats: ['deb', 'flatpak', 'snap']
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('3d-design');
  const [checkedApps, setCheckedApps] = useState<Set<string>>(new Set());
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleAppClick = (appId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).tagName === 'INPUT' || 
        (event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }

    setCheckedApps(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(appId)) {
        newChecked.delete(appId);
      } else {
        newChecked.add(appId);
      }
      return newChecked;
    });
  };

  const handleCheckboxChange = (appId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedApps(prev => {
      const newChecked = new Set(prev);
      if (event.target.checked) {
        newChecked.add(appId);
      } else {
        newChecked.delete(appId);
      }
      return newChecked;
    });
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(prev => !prev);
  };

  // Get sections for active category
  const activeSections = sections.filter(section => section.categoryId === activeCategory);
  
  // Get applications for each section in the active category
  const getApplicationsForSection = (sectionId: string) => {
    return applications.filter(app => 
      app.categoryId === activeCategory && app.sectionId === sectionId
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <button>About</button>
          <button>Help</button>
          <button>Settings</button>
        </nav>
        <div className={styles.logo}>Linux Mint Studiofy</div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.categoriesWrapper}>
              <div className={styles.categories}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`${styles.categoryButton} ${category.id === activeCategory ? styles.active : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.presetsWrapper}>
              <hr className={styles.divider} />
              <button className={styles.presets}>PRESETS</button>
            </div>
          </div>
        </aside>
        
        <div className={styles.contentWrapper}>
          <div className={styles.contentHeader}>
            <button 
              className={`${styles.advancedButton} ${isAdvancedMode ? styles.active : ''}`}
              onClick={toggleAdvancedMode}
            >
              Advanced Mode
            </button>
          </div>
          <div className={styles.content}>
            {activeSections.map(section => (
              <section key={section.id} className={styles.section}>
                <h2>{section.title}</h2>
                <div className={styles.applications}>
                  {getApplicationsForSection(section.id).map(app => (
                    <div key={app.id} className={styles.appCardContainer}>
                      <div 
                        className={styles.appCard}
                        onClick={(e) => handleAppClick(app.id, e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.appHeader}>
                          <input 
                            type="checkbox"
                            checked={checkedApps.has(app.id)}
                            onChange={(e) => handleCheckboxChange(app.id, e)}
                          />
                          <span>{app.name}</span>
                          <button 
                            className={styles.infoButton}
                            onClick={(e) => e.stopPropagation()}
                          >
                            i
                          </button>
                        </div>
                      </div>
                      {isAdvancedMode && app.formats && app.formats.length > 0 && (
                        <div className={styles.formatsCard}>
                          <div className={styles.formats}>
                            {app.formats.map(format => (
                              <label 
                                key={format} 
                                className={styles.formatOption}
                              >
                                <input type="radio" name={`format-${app.id}`} />
                                <span>{format}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          
          <div className={styles.actions}>
            <button className={styles.installPage}>Install Page</button>
            <button className={styles.installAll}>Install All</button>
            <button className={styles.resetPage}>Reset Page</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;