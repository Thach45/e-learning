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
       className={`flex items-center text-xl font-medium gap-3 rounded-lg px-3 py-2 transition-colors dark:text-white ${isActive ?  `bg-blue-500 text-white dark:bg-slate-800`:` hover:bg-blue-500 hover:text-white dark:hover:bg-slate-800`}` }>
        {icon}
        <span className="text-lg">{title}</span>
      </Link>
    </li>
  );
};

export default Items;