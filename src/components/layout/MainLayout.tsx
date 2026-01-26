import React from "react";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

/**
 * MainLayout - For public pages (landing, course catalog)
 * Structure: Header + Content + Footer
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};
