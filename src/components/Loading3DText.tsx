'use client';

import React from 'react';
import styles from './styles/Loading3DText.module.css';

const Loading3DText = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background transition-colors relative">
            <div className={styles.loader}>
            </div>
        </div>
    );
};

export default Loading3DText;
