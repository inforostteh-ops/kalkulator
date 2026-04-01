import React, { ReactNode } from 'react';
import TopBar from './TopBar';
import styles from '../styles/layout.module.css';

interface LayoutProps {
  children: ReactNode;
  onExport?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onExport }) => {
  return (
    <div className={styles.layout}>
      <TopBar onExport={onExport} />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Volume Calculator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
