import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageContainer } from './PageContainer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <div className="flex-1">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <Footer />
    </div>
  );
};