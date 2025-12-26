import React, { useState } from 'react';
import { 
    Calculator, ShieldCheck, CheckCircle, X, AlertTriangle, Calendar, 
    Zap, Truck, Home, GraduationCap, Euro, FileText, Send, HelpCircle 
} from 'lucide-react';
import { content } from '../constants';
import { Language, ViewState, SubsidyData } from '../types';

interface SubsidyToolProps {
    lang: Language;
    onNavigate: (view: ViewState) => void;
    subsidyData: SubsidyData;
    setSubsidyData: React.Dispatch<React.SetStateAction<SubsidyData>>;
}

const SubsidyTool: React.FC<SubsidyToolProps> = ({ lang, onNavigate, subsidyData, setSubsidyData }) => {
    const [subsidyStep, setSubsidyStep] = useState(1);
    const tt = content[lang].tool;

    const handleCategoryToggle = (category: string) => {
        setSubsidyData(prev => {
            const cats = prev.categories.includes(category) 
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories: cats };
        });
    };

    const nextFromStep3 = () => {
        if (subsidyData.categories.length === 0) return alert("Select at least one.");
        setSubsidyStep(5);
    };

    const calculateSubsidies = () => {
        const results = [];
        if ((subsidyData.categories.includes('ev') && subsidyData.invoiceValue) || 
            (subsidyData.categories.includes('building'))) {
            results.push({ type: 'mia', title: tt.step5.card_mia, desc: tt.step5.card_mia_desc });
        }
        if (subsidyData.categories.includes('fleet') && subsidyData.isElectricVehicle && subsidyData.isHeavyVehicle) {
            results.push({ type: 'seba', title: tt.step5.card_seba, desc: tt.step5.card_seba_desc });
        }
        if (subsidyData.categories.includes('training') && subsidyData.smallStaff) {
            results.push({ type: 'slim', title: tt.step5.card_slim, desc: tt.step5.card_slim_desc });
        }
        
        if (results.length === 0 && subsidyData.categories.length > 0) {
            results.push({ type: 'mia', title: tt.step5.card_mia, desc: tt.step5.card_mia_desc });
        }
        return results;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-900 px-4 py-4 md:px-8 md:py-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-green-400" />
                        Demandio Subsidy Finder
                    </h2>
                    <div className="text-sm opacity-80">Step {subsidyStep > 4 ? subsidyStep - 1 : subsidyStep} / 5</div>
                </div>

                <div className="w-full bg-gray-200 h-2">
                    <div className="bg-green-500 h-2 transition-all duration-500" style={{ width: `${(subsidyStep > 4 ? (subsidyStep-1)/5 : subsidyStep/5)*100}%` }}></div>
                </div>

                <div className="p-4 md:p-8">
                    <button onClick={() => onNavigate('choice')} className="text-sm text-gray-400 mb-4 hover:text-gray-600">← Back to Hub</button>
                    
                    {/* STEP 1: Gatekeeper */}
                    {subsidyStep === 1 && (
                        <div className="animate-fade-in">
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-10 h-10 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">{tt.step1.title}</h3>
                            <p className="text-gray-600 text-center mb-8">{tt.step1.msg}</p>
                            
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
                                <p className="font-bold text-lg mb-4 text-blue-900">{tt.step1.q}</p>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => { setSubsidyData({...subsidyData, hasEH3: true}); setSubsidyStep(2); }}
                                        className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500" /> {tt.step1.yes}
                                    </button>
                                    <button 
                                        onClick={() => setSubsidyData({...subsidyData, hasEH3: false})}
                                        className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition flex items-center gap-2"
                                    >
                                        <X className="w-5 h-5 text-red-500" /> {tt.step1.no}
                                    </button>
                                </div>
                            </div>

                            {subsidyData.hasEH3 === false && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4 flex gap-3">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-yellow-800">{tt.step1.alert}</p>
                                        <button onClick={() => setSubsidyStep(2)} className="text-blue-600 font-bold text-sm mt-2 hover:underline">
                                            Continue Check &rarr;
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: 90-Day Rule */}
                    {subsidyStep === 2 && (
                        <div className="animate-fade-in">
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-10 h-10 text-orange-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">{tt.step2.title}</h3>
                            <p className="text-gray-600 text-center mb-8">{tt.step2.msg}</p>

                            <div className="space-y-4 max-w-lg mx-auto">
                                <p className="font-bold text-lg mb-2 text-gray-900">{tt.step2.q}</p>
                                <button 
                                    onClick={() => { setSubsidyData({...subsidyData, recentPurchase: true}); setSubsidyStep(3); }}
                                    className="w-full text-left px-6 py-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-medium"
                                >
                                    {tt.step2.yes}
                                </button>
                                <button 
                                    onClick={() => { setSubsidyData({...subsidyData, recentPurchase: false}); setSubsidyStep(3); }}
                                    className="w-full text-left px-6 py-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-medium"
                                >
                                    {tt.step2.no}
                                </button>
                            </div>
                            
                            <div className="mt-8 flex justify-between">
                                <button onClick={() => setSubsidyStep(1)} className="text-gray-400 hover:text-gray-600">{tt.back}</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Categories */}
                    {subsidyStep === 3 && (
                        <div className="animate-fade-in">
                            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">{tt.step3.title}</h3>
                            <p className="text-gray-600 text-center mb-8">{tt.step3.msg}</p>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {/* EV SECTION */}
                                <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('ev') ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div onClick={() => handleCategoryToggle('ev')} className="cursor-pointer p-4 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('ev') ? 'bg-blue-200' : 'bg-gray-100'}`}>
                                            <Zap className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <span className="font-semibold text-lg">{tt.step3.opt_ev}</span>
                                        {subsidyData.categories.includes('ev') && <CheckCircle className="ml-auto w-6 h-6 text-blue-600" />}
                                    </div>
                                    {subsidyData.categories.includes('ev') && (
                                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                                            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm mt-2 ml-4 md:ml-12">
                                                <p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_ev}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setSubsidyData({...subsidyData, invoiceValue: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.invoiceValue === true ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button>
                                                    <button onClick={() => setSubsidyData({...subsidyData, invoiceValue: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.invoiceValue === false ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* FLEET SECTION */}
                                <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('fleet') ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-300'}`}>
                                    <div onClick={() => handleCategoryToggle('fleet')} className="cursor-pointer p-4 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('fleet') ? 'bg-orange-200' : 'bg-gray-100'}`}>
                                            <Truck className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <span className="font-semibold text-lg">{tt.step3.opt_fleet}</span>
                                        {subsidyData.categories.includes('fleet') && <CheckCircle className="ml-auto w-6 h-6 text-orange-600" />}
                                    </div>
                                    {subsidyData.categories.includes('fleet') && (
                                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                                            <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm mt-2 ml-4 md:ml-12 space-y-4">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_fleet_electric}</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setSubsidyData({...subsidyData, isElectricVehicle: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isElectricVehicle === true ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button>
                                                        <button onClick={() => setSubsidyData({...subsidyData, isElectricVehicle: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isElectricVehicle === false ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_fleet_weight}</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setSubsidyData({...subsidyData, isHeavyVehicle: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isHeavyVehicle === true ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button>
                                                        <button onClick={() => setSubsidyData({...subsidyData, isHeavyVehicle: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.isHeavyVehicle === false ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* BUILDING */}
                                <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('building') ? 'border-green-500 bg-green-50/50' : 'border-gray-200 hover:border-green-300'}`}>
                                    <div onClick={() => handleCategoryToggle('building')} className="cursor-pointer p-4 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('building') ? 'bg-green-200' : 'bg-gray-100'}`}>
                                            <Home className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <span className="font-semibold text-lg">{tt.step3.opt_building}</span>
                                        {subsidyData.categories.includes('building') && <CheckCircle className="ml-auto w-6 h-6 text-green-600" />}
                                    </div>
                                </div>
                                {/* TRAINING */}
                                <div className={`rounded-xl border-2 transition-all ${subsidyData.categories.includes('training') ? 'border-purple-500 bg-purple-50/50' : 'border-gray-200 hover:border-purple-300'}`}>
                                    <div onClick={() => handleCategoryToggle('training')} className="cursor-pointer p-4 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${subsidyData.categories.includes('training') ? 'bg-purple-200' : 'bg-gray-100'}`}>
                                            <GraduationCap className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <span className="font-semibold text-lg">{tt.step3.opt_training}</span>
                                        {subsidyData.categories.includes('training') && <CheckCircle className="ml-auto w-6 h-6 text-purple-600" />}
                                    </div>
                                    {subsidyData.categories.includes('training') && (
                                        <div className="px-4 pb-4 pt-0 animate-fade-in">
                                            <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm mt-2 ml-4 md:ml-12">
                                                <p className="text-sm font-bold text-gray-800 mb-2">{tt.step3.q_training}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setSubsidyData({...subsidyData, smallStaff: true})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.smallStaff === true ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.yes}</button>
                                                    <button onClick={() => setSubsidyData({...subsidyData, smallStaff: false})} className={`px-3 py-1 text-sm rounded-md border transition ${subsidyData.smallStaff === false ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>{tt.no}</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <button onClick={() => setSubsidyStep(2)} className="text-gray-400 hover:text-gray-600">{tt.back}</button>
                                <button onClick={nextFromStep3} className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg">{tt.next} &rarr;</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Results */}
                    {subsidyStep === 5 && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tt.step5.title}</h3>
                                <p className="text-gray-600">{tt.step5.msg}</p>
                            </div>

                            <div className="grid gap-4 mb-8">
                                {calculateSubsidies().map((item, index) => (
                                    <div key={index} className="bg-white border-2 border-green-500 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:scale-105 transition-transform">
                                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">ELIGIBLE</div>
                                        <h4 className="text-xl font-extrabold text-blue-900 mb-2 flex items-center gap-2">
                                            <CheckCircle className="text-green-500" /> {item.title}
                                        </h4>
                                        <p className="text-gray-600 font-medium">{item.desc}</p>
                                    </div>
                                ))}
                                {calculateSubsidies().length === 0 && (
                                    <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                                        <p>Based on inputs, no specific standard subsidies match, but contact us for a custom check.</p>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setSubsidyStep(6)} className="w-full bg-green-500 text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-green-400 transition shadow-lg text-lg animate-pulse">
                                Claim Opportunities &rarr;
                            </button>
                        </div>
                    )}

                    {/* STEP 6: CTA */}
                    {subsidyStep === 6 && (
                        <div className="animate-fade-in text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Euro className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{tt.step6.title}</h3>
                            <p className="text-gray-600 mb-8 text-lg">{tt.step6.msg}</p>

                            <div className="grid gap-4 max-w-md mx-auto">
                                <button className="flex items-center justify-center gap-3 bg-blue-900 text-white p-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
                                    <FileText /> {tt.step6.btn_esg}
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-white text-blue-900 border-2 border-blue-900 p-4 rounded-xl font-bold hover:bg-blue-50 transition">
                                    <Send /> {tt.step6.btn_acc}
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-gray-100 text-gray-700 p-4 rounded-xl font-bold hover:bg-gray-200 transition">
                                    <HelpCircle /> {tt.step6.btn_consult}
                                </button>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <button onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-gray-600">Back to Home</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubsidyTool;