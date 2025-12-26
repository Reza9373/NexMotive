import React, { useState } from 'react';
import LandingPage from './views/LandingPage';
import ToolsDashboard from './views/ToolsDashboard';
import SubsidyTool from './views/SubsidyTool';
import VSMETool from './views/VSMETool';
import { Language, FormData, SubsidyData, VSMEData, VSMEConfig, ViewState } from './types';

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('nl');
    const [currentView, setCurrentView] = useState<ViewState>('landing');

    // Global State
    const [formData, setFormData] = useState<FormData>({ 
        name: '', 
        email: '', 
        company: '', 
        city: '', 
        role: '', 
        customRole: '',
        newsletter: false
    });

    const [subsidyData, setSubsidyData] = useState<SubsidyData>({
        hasEH3: null, 
        recentPurchase: null, 
        categories: [], 
        invoiceValue: null, 
        isElectricVehicle: null, 
        isHeavyVehicle: null, 
        smallStaff: null 
    });

    const [vsmeConfig, setVsmeConfig] = useState<VSMEConfig>({ 
        listed: false, 
        bpModule: false, 
        comprehensive: false 
    });

    const [vsmeData, setVsmeData] = useState<VSMEData>({
        isListed: 'no',
        reportPurpose: 'basic',
        hasPolicies: 'no',
        b1_name: '', b1_basis: 'Individual basis', b1_legal_form: '', b1_nace: '', b1_country: '', b1_turnover: '', b1_employees: '',
        b2_practices: '',
        b3_energy_total: '', b3_energy_ren: '', b3_energy_nonren: '', b3_scope1: '', b3_scope2: '',
        b4_pollution: '', b5_sensitive: '', b6_water: '', b7_waste_haz: '', b7_waste_recycled: '',
        b8_perm: '', b8_temp: '', b8_female: '', b9_accidents: '', b10_minwage: 'Yes',
        b11_convictions: '', b11_fines: '',
        bp_code: 'No', bp_grievance: 'No', bp_payment: '', bp_excluded_rev: '', bp_scope3_status: 'Not Measured', bp_climate_risks: '',
        c1_strategy: '', c2_policies: '', c3_targets: '', c4_risks: '', c5_mgmt_gender: '', c6_policy: 'No', c7_incidents: 'None', c8_revenue: '', c9_board_gender: ''
    });

    const renderView = () => {
        switch (currentView) {
            case 'landing':
                return (
                    <LandingPage 
                        lang={lang} 
                        setLang={setLang} 
                        formData={formData} 
                        setFormData={setFormData}
                        onNavigate={setCurrentView} 
                    />
                );
            case 'choice':
                return (
                    <ToolsDashboard 
                        lang={lang} 
                        userName={formData.name} 
                        onNavigate={setCurrentView} 
                    />
                );
            case 'subsidy_tool':
                return (
                    <SubsidyTool 
                        lang={lang} 
                        onNavigate={setCurrentView}
                        subsidyData={subsidyData}
                        setSubsidyData={setSubsidyData}
                    />
                );
            case 'vsme_tool':
                return (
                    <VSMETool 
                        onNavigate={setCurrentView}
                        vsmeData={vsmeData}
                        setVsmeData={setVsmeData}
                        vsmeConfig={vsmeConfig}
                        setVsmeConfig={setVsmeConfig}
                    />
                );
            default:
                return <div>404 Not Found</div>;
        }
    };

    return (
        <React.Fragment>
            {renderView()}
        </React.Fragment>
    );
};

export default App;