import React from 'react';
import { usePage } from '@inertiajs/react';

export default function CompanyDetails() {
    const { company = {} } = usePage().props;

    if (!company.name && !company.reg_number && !company.address && !company.email) return null;

    return (
        <address className="not-italic text-sm leading-relaxed space-y-2 min-w-0 break-words">
            {company.name && <p className="font-bold text-slate-100">{company.name}</p>}
            {company.reg_number && <p><span className="text-slate-500">Registration number: </span>{company.reg_number}</p>}
            {company.address && <p className="whitespace-pre-line">{company.address}</p>}
            {company.email && <a className="inline-block text-cyan-400 hover:underline break-all py-2" href={`mailto:${company.email}`}>{company.email}</a>}
        </address>
    );
}
