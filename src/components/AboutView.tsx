import React from 'react';
import {
  Compass,
  MapPin,
  BookOpen,
  Route,
  Clock,
  Sparkles,
  Heart,
  Globe2,
  ShieldCheck,
  Bookmark,
  ExternalLink,
  Layers,
  HelpCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { PLACES_DATA } from '../data/placesData';

interface AboutViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenDaily: () => void;
  onLocatePlaceById?: (placeId: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateTab,
  onOpenDaily,
}) => {
  const currentYear = new Date().getFullYear();

  const keyFeatures = [
    {
      icon: <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      titleMl: 'ഇന്ററാക്ടീവ് ബൈബിൾ മാപ്പ്',
      titleEn: 'Interactive Geospatial Map',
      descMl:
        'കാർട്ടോഡിബി (CartoDB), എസ്റി സാറ്റലൈറ്റ് (Esri Satellite), ടോപ്പോഗ്രാഫിക് മാപ്പുകൾ എന്നിവയിലൂടെ വിശുദ്ധ ദേശങ്ങളിലെ പുരാതന നഗരങ്ങളും പർവ്വതങ്ങളും നദികളും നേരിട്ട് കണ്ടെത്താം.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      titleMl: 'സ്ഥലങ്ങളുടെ സമ്പൂർണ്ണ ഡയറക്ടറി',
      titleEn: '70+ Biblical Places Directory',
      descMl:
        'യെരൂശലേം, ബെത്‌ലഹേം, നസറേത്ത് തുടങ്ങിയ പ്രമുഖ ബൈബിൾ സ്ഥലങ്ങളുടെ ചരിത്രം, പ്രാധാന്യം, ആധുനിക രാജ്യങ്ങൾ, വേദവാക്യ റഫറൻസുകൾ എന്നിവ ക്രമമായി ലഭിക്കുന്നു.',
    },
    {
      icon: <Route className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      titleMl: 'പൗലോസിന്റെ മിഷനറി യാത്രകൾ',
      titleEn: "Paul's Missionary Journeys",
      descMl:
        'അപ്പൊസ്തലനായ പൗലോസിന്റെ 1, 2, 3 മിഷനറി യാത്രകളും റോമിലേക്കുള്ള ചരിത്രപരമായ കപ്പൽയാത്രയും മാപ്പിൽ ഓരോ സ്റ്റോപ്പുകളായി രേഖപ്പെടുത്തിയിരിക്കുന്നു.',
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      titleMl: 'യേശുവിന്റെ ശുശ്രൂഷാ വഴികൾ',
      titleEn: "Jesus' Ministry Route",
      descMl:
        'കർത്താവായ യേശുക്രിസ്തുവിന്റെ ജനനം മുതൽ ഗലീല, ശമര്യ, യെരൂശലേം, കാൽവറി വരെയുള്ള ശുശ്രൂഷാ പാതകളും അത്ഭുതങ്ങളും അടയാളങ്ങളും ദർശിക്കാം.',
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      titleMl: 'ചരിത്ര കാലഗണന (ടൈംലൈൻ)',
      titleEn: 'Chronological Biblical Timeline',
      descMl:
        'ഗോത്രപിതാക്കന്മാരുടെ കാലം (ബി.സി. 2000) മുതൽ അപ്പൊസ്തലിക യുഗം (എ.ഡി. 95) വരെയുള്ള സുപ്രധാന ബൈബിൾ സംഭവങ്ങൾ കാലഗണനാക്രമത്തിൽ സന്ദർശിക്കാം.',
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-700 dark:text-amber-300" />,
      titleMl: 'സത്യവേദപുസ്തകം മലയാളം റീഡർ',
      titleEn: 'Integrated Malayalam Scripture Reader',
      descMl:
        'ഏതൊരു സ്ഥലത്തെക്കുറിച്ചുമുള്ള വിവരണം വായിക്കുമ്പോൾ തന്നെ ബന്ധപ്പെട്ട മുഴുവൻ വേദാധ്യായവും മലയാളത്തിൽ (BSI Sathya Veda Pusthakam) നേരിട്ട് വായിക്കാം.',
    },
  ];

  const geographicalRegions = [
    {
      nameMl: 'ഗലീല (Galilee)',
      modern: 'വടക്കൻ ഇസ്രായേൽ',
      highlights: 'നസറേത്ത്, കഫernaവുമ്, ഗലീലക്കടൽ, കാനാ',
      desc: 'യേശുക്രിസ്തു തന്റെ ശുശ്രൂഷയുടെ ഭൂരിഭാഗവും ചെലവഴിച്ച മലനിരകളും തടാകതീരങ്ങളും.',
    },
    {
      nameMl: 'ശമര്യ (Samaria)',
      modern: 'വെസ്റ്റ് ബാങ്ക് / പലസ്തീൻ',
      highlights: 'ശേഖേം, ശമര്യ നഗരം, യാക്കോബിന്റെ കിണർ',
      desc: 'വടക്കൻ ഇസ്രായേൽ രാജ്യത്തിന്റെ തലസ്ഥാനവും സുപ്രധാന ചരിത്ര കേന്ദ്രവും.',
    },
    {
      nameMl: 'യൂദെയ (Judea)',
      modern: 'മധ്യ/തെക്കൻ ഇസ്രായേൽ & പലസ്തീൻ',
      highlights: 'യെരൂശലേം, ബെത്‌ലഹേം, യെരീഹോ, ഹെബ്രോൻ, ഒലിവ് മല',
      desc: 'ദാവീദിന്റെ രാജവംശവും ദൈവാലയവും സ്ഥിതിചെയ്തിരുന്ന പവിത്ര പ്രദേശം.',
    },
    {
      nameMl: 'ഏഷ്യാമൈനർ & ഗ്രീസ് (Asia Minor & Greece)',
      modern: 'തുർക്കി, ഗ്രീസ്, സൈപ്രസ്, മാസിഡോണിയ',
      highlights: 'എഫെസൊസ്, കൊരിന്ത്, ഫിലിപ്പി, അന്ത്യോക്യ, അഥേന',
      desc: 'ആദിമ സഭയുടെ വ്യാപനവും പൗലോസിന്റെ പ്രബോധനങ്ങളും നടന്ന ഗ്രീക്കോ-റോമൻ ലോകം.',
    },
    {
      nameMl: 'ഈജിപ്റ്റും സീനായ് മരുഭൂമിയും (Egypt & Sinai)',
      modern: 'ഈജിപ്റ്റ് (സീനായ് ഉപദ്വീപ്)',
      highlights: 'സീനായ് പർവ്വതം, ഗോശെൻ, ചെങ്കടൽ, നൈൽ നദി',
      desc: 'ഇസ്രായേൽ ജനത്തിന്റെ പുറപ്പാടും ന്യായപ്രമാണ സമർപ്പണവും സംഭവിച്ച പ്രദേശം.',
    },
    {
      nameMl: 'മെസൊപ്പൊട്ടേമിയ (Mesopotamia)',
      modern: 'ഇറാഖ്, സിറിയ, ഇറാൻ',
      highlights: 'കൽദയരുടെ ഊർ, ബാബിലോൺ, നീനെവേ, യൂഫ്രട്ടീസ് & ടൈഗ്രിസ്',
      desc: 'അബ്രാഹാമിന്റെ ജന്മദേശവും ബാബിലോൺ പ്രവാസത്തിന്റെ വേദിയും.',
    },
  ];

  const faqs = [
    {
      qMl: 'ഈ അറ്റ്ലസിലെ സ്ഥലങ്ങളുടെ സ്ഥാനം എത്രത്തോളം കൃത്യമാണ്?',
      qEn: 'How accurate are the biblical coordinates on this map?',
      aMl:
        'ബൈബിൾ സ്ഥലങ്ങളുടെ ഭൂരിഭാഗവും ആധുനിക പുരാവസ്തു ഗവേഷണങ്ങളിലൂടെയും (Archaeological excavations) ചരിത്രപരമായ കണ്ടെത്തലുകളിലൂടെയും സ്ഥിരീകരിക്കപ്പെട്ട കൃത്യമായ കോർഡിനേറ്റുകളിലാണ് അടയാളപ്പെടുത്തിയിരിക്കുന്നത്. ചില പുരാതന സ്ഥാനങ്ങൾ പാരമ്പര്യമായി സ്വീകരിക്കപ്പെട്ട സ്ഥലങ്ങളെ (traditional sites) അടിസ്ഥാനമാക്കിയുള്ളതാണ്.',
    },
    {
      qMl: 'ഇതിലെ മലയാളം വേദവാക്യങ്ങൾ ഏത് വിവർത്തനമാണ്?',
      qEn: 'Which Malayalam Bible translation is used?',
      aMl:
        'കേരളത്തിലെ ക്രൈസ്തവർ നൂറ്റാണ്ടുകളായി ഉപയോഗിക്കുന്ന വിശ്വസനീയമായ പബ്ലിക് ഡൊമെയ്ൻ സത്യവേദപുസ്തകം (1910 BSI Sathya Veda Pusthakam) വിവർത്തനമാണ് ഇവിടെ പൂർണ്ണമായും ഉപയോഗിച്ചിരിക്കുന്നത്.',
    },
    {
      qMl: 'എനിക്ക് ഇഷ്ടപ്പെട്ട സ്ഥലങ്ങൾ സേവ് ചെയ്യാൻ കഴിയുമോ?',
      qEn: 'Can I bookmark and save my favorite places?',
      aMl:
        'തീർച്ചയായും! ഓരോ സ്ഥലത്തിന് നേരെയുമുള്ള ബുക്ക്മാർക്ക് (Star / Bookmark) ഐക്കണിൽ ക്ലിക്ക് ചെയ്താൽ അത് നിങ്ങളുടെ ബ്രൗസറിൽ തദ്ദേശീയമായി (LocalStorage) സംരക്ഷിക്കപ്പെടും. ഇൻറർനെറ്റ് കണക്ഷൻ ഇല്ലാതെയും നിങ്ങൾ അടയാളപ്പെടുത്തിയവ ലഭ്യമാകും.',
    },
    {
      qMl: 'സൺഡേ സ്കൂളുകൾക്കും ബൈബിൾ ക്ലാസുകൾക്കും ഇത് ഉപയോഗിക്കാമോ?',
      qEn: 'Can this be used for Sunday Schools, Bible study groups, and personal devotions?',
      aMl:
        'അതെ, ദൈവവചനം ആഴത്തിൽ പഠിക്കുവാനും കുട്ടികൾക്കും മുതിർന്നവർക്കും ബൈബിൾ ഭൂമിശാസ്ത്രം ലളിതമായി മനസ്സിലാക്കുവാനും ഇത് തികച്ചും സൗജന്യമായി ഉപയോഗിക്കാവുന്നതാണ്.',
    },
  ];

  return (
    <div className="w-full min-h-full pb-28 md:pb-12 bg-stone-50 dark:bg-stone-950 transition-colors">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/70 via-amber-50/40 to-stone-50 dark:from-stone-900 dark:via-stone-900/60 dark:to-stone-950 border-b border-amber-200/60 dark:border-stone-800 pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-200/60 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>വിവരണം • About the Project</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-serif mb-3">
            ബൈബിൾ സ്ഥലങ്ങൾ
          </h1>
          <p className="text-base sm:text-xl font-bold text-amber-800 dark:text-amber-400 font-scripture mb-4">
            Bible Places Explorer • മലയാളം ബൈബിൾ അറ്റ്ലസ്
          </p>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            വിശുദ്ധ വേദപുസ്തകത്തിലെ ചരിത്ര പ്രസിദ്ധ സ്ഥലങ്ങൾ, മാപ്പുകൾ, യാത്രാ വഴികൾ, കാലഗണന, മലയാളം സത്യവേദപുസ്തക വാക്യങ്ങൾ എന്നിവ വിരൽത്തുമ്പിൽ ലഭ്യമാക്കുന്ന സമഗ്ര ഇന്ററാക്ടീവ് ഡിജിറ്റൽ സഹായി.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6">
            <button
              onClick={() => onNavigateTab('map')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-900/15 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>മാപ്പ് തുറക്കുക (Open Map)</span>
            </button>
            <button
              onClick={() => onNavigateTab('places')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700/80 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>സ്ഥലങ്ങൾ കാണുക (Browse Places)</span>
            </button>
            <button
              onClick={onOpenDaily}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 border border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>ഇന്നത്തെ സ്ഥലം (Today's Place)</span>
            </button>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-300/10 dark:bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-orange-300/10 dark:bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* SECTION 1: FOOTER DETAILS & DEVELOPER ATTRIBUTION (Prominent Feature) */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-850 rounded-2xl border-2 border-amber-300/80 dark:border-amber-800/60 p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" />
                <span>പദ്ധതിയുടെ വിവരങ്ങൾ • Project Credits</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                ബൈബിൾ സ്ഥലങ്ങൾ (Bible Places Explorer)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
                വിശുദ്ധ വേദപുസ്തക പഠിതാക്കൾക്കും പ്രസംഗകർക്കും സൺഡേസ്കൂൾ അദ്ധ്യാപകർക്കും വേണ്ടി സമർപ്പിതമായ സ്വതന്ത്ര വിദ്യാഭ്യാസ ഉദ്യമം.
              </p>
            </div>

            {/* Developer Card & AI badge */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  JS
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <span>Developed by</span>
                    <span className="font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                      JoelStan
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600 dark:text-stone-300">
                    <span>crafted using AI</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Copyright Badge */}
              <div className="text-[11px] text-stone-500 dark:text-stone-400 text-center md:text-right">
                © {currentYear} All Rights Reserved • Bible Places Explorer
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHY BIBLE GEOGRAPHY MATTERS */}
        <section className="space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>എന്തുകൊണ്ട് ബൈബിൾ ഭൂമിശാസ്ത്രം പ്രധാനം?</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Why Biblical Geography Matters for Scripture Understanding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span>ചരിത്രപരമായ യാഥാർത്ഥ്യം</span>
              </div>
              <p>
                ബൈബിൾ സാങ്കൽപ്പിക കഥകളുടെ പുസ്തകമല്ല. അത് യഥാർത്ഥ നഗരങ്ങളിലും മലനിരകളിലും മരുഭൂമികളിലും ജീവിച്ച മനുഷ്യരുമായി ദൈവം ഇടപെട്ട ചരിത്രമാണ്. സ്ഥലങ്ങളെ അറിയുമ്പോൾ വചനം കൂടുതൽ ജീവസ്സുറ്റതാകുന്നു.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span>ദൂരവും ഭൂപ്രകൃതിയും</span>
              </div>
              <p>
                നസറേത്തിൽ നിന്ന് ബെത്‌ലഹേമിലേക്കുള്ള മറിയയുടെ യാത്രയോ, യെരൂശലേമിൽ നിന്ന് ഗസ്സയിലേക്കുള്ള വഴിയിലെ മരുഭൂമിയോ നേരിട്ട് കാണുമ്പോൾ ബൈബിൾ കാലഘട്ടത്തിലെ യാത്രകളുടെ കാഠിന്യവും വിശ്വാസത്യാഗവും മനസ്സിലാക്കാം.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span>ആത്മീയ വെളിപ്പാടുകൾ</span>
              </div>
              <p>
                സീനായ് മലയിലെ നിയമം, കർമ്മേൽ മലയിലെ എലീയാവിന്റെ പ്രാർത്ഥന, ഒലിവ് മലയിലെ യേശുവിന്റെ വിലാപം എന്നിവയെല്ലാം അവ സംഭവിച്ച ഭൂപ്രകൃതിയുമായി അഗാധമായി ബന്ധപ്പെട്ടിരിക്കുന്നു.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: KEY EXPLORATION MODES */}
        <section className="space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>പ്രധാന സവിശേഷതകളും പഠന വിഭാഗങ്ങളും</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Core Modules & Exploration Tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                    {feat.titleMl}
                  </h4>
                  <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {feat.titleEn}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {feat.descMl}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: BIBLICAL GEOGRAPHY REGIONS GUIDE */}
        <section className="space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>ബൈബിളിലെ പ്രധാന ഭൂവിഭാഗങ്ങൾ</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Major Biblical Regions and Their Modern Geography
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {geographicalRegions.map((reg, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm sm:text-base">
                      {reg.nameMl}
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                      {reg.modern}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {reg.desc}
                  </p>
                  <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      പ്രധാന കേന്ദ്രങ്ങൾ:{' '}
                    </span>
                    {reg.highlights}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: DATA SOURCES & BIBLICAL TRANSLATION */}
        <section className="space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>വിവര സ്രോതസ്സുകളും ആധികാരികതയും</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Scriptural Text, Geographic Data & Open Source Contributions
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-200/60 dark:border-stone-700/60">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>വേദപുസ്തക പാഠം (Biblical Text)</span>
                </div>
                <p className="text-xs">
                  സത്യവേദപുസ്തകം (1910 BSI Malayalam Bible Text, Public Domain). ഇംഗ്ലീഷ് റഫറൻസുകൾക്കായി World English Bible (WEB) & King James Version (KJV).
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/50 dark:bg-stone-800/50 border border-amber-200/60 dark:border-stone-700/60">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>ഭൂമിശാസ്ത്ര വിവരങ്ങൾ (Geospatial Data)</span>
                </div>
                <p className="text-xs">
                  OpenStreetMap (OSM) contributors, CartoDB Voyager tiles, Esri World Imagery (satellite high-resolution basemap), Open-Elevation API.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-3">
              ഈ വെബ്‌സൈറ്റ് തികച്ചും ലാഭേച്ഛയില്ലാത്തതും ക്രൈസ്തവ വിശ്വാസികൾക്കും വേദവിദ്യാർത്ഥികൾക്കും ഗവേഷകർക്കും സൺഡേ സ്കൂൾ കുട്ടികൾക്കും ഉപകാരപ്രദമാകുന്നതിനായി തയ്യാറാക്കപ്പെട്ടതുമാണ്.
            </p>
          </div>
        </section>

        {/* SECTION 6: FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section className="space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQ)</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Frequently Asked Questions & User Guide
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-2"
              >
                <div className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                  {faq.qMl}
                </div>
                <div className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  {faq.qEn}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                  {faq.aMl}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM FINAL CARD WITH DEVELOPER & SUMMARY */}
        <div className="text-center py-6 px-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 space-y-2">
          <div className="flex items-center justify-center gap-2 font-semibold text-stone-800 dark:text-stone-200">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>ബൈബിൾ സ്ഥലങ്ങൾ • Bible Places Explorer</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span>Designed & Developed by</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">JoelStan</span>
            <span>using AI</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div>© {currentYear} All Rights Reserved</div>
        </div>
      </div>
    </div>
  );
};
