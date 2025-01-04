"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TLinkItem } from '@/types';

const Items = ({
  link,
  icon,
  title
}: TLinkItem) => {
  const pathName = usePathname();
  const isActive = pathName === link;
  

  return (
    <li>
      <Link href={link}
       className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors dark:text-white ${isActive ?  `bg-gray-100 dark:bg-slate-800`:` hover:bg-gray-100 dark:hover:bg-slate-800`}` }>
        {icon}
        <span>{title}</span>
      </Link>
    </li>
  );
};

export default Items;