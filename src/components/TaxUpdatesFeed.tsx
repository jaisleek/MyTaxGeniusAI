import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Loader2, ArrowUpRight, ShieldAlert } from 'lucide-react';
import Markdown from 'react-markdown';

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

interface TaxUpdateResponse {
  success: boolean;
  text: string;
  chunks: GroundingChunk[];
  error?: string;
}

export function TaxUpdatesFeed() {
  const [updates, setUpdates] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/tax-updates');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data: TaxUpdateResponse = await response.json();
        if (data.error) throw new Error(data.error);

        if (data.text) {
          setUpdates(data.text);
          setSources(data.chunks || []);
        } else {
          setError('Failed to fetch updates.');
        }
      } catch (err: any) {
        console.error('Error fetching tax updates:', err);
        setError('Could not connect to the intel server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300 py-16 lg:py-24 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm border border-emerald-100 dark:border-emerald-800/50 mb-4 tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
              Live News
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Latest Tax Policy Updates
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Real-time updates directly from NRS and national news sources.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-600" />
               <p className="font-bold text-slate-600 dark:text-slate-300">Loading recent updates...</p>
               <p className="text-sm">Fetching from reliable sources</p>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Updates Unavailable</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">{error}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 p-8 lg:p-12">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-p:font-medium">
                  <Markdown>{updates}</Markdown>
                </div>
              </div>

              {/* Sidebar with Sources */}
              <div className="p-8 lg:p-10 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center">
                  <Newspaper className="w-4 h-4 mr-2 text-slate-400" />
                  Verified Sources
                </h3>
                
                <div className="space-y-4">
                  {sources.filter(s => s.web?.uri && s.web?.title).map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.web!.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm"
                    >
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {source.web!.title}
                      </h4>
                      <div className="mt-3 flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                        Read Full Article <ArrowUpRight className="w-3 h-3 ml-1" />
                      </div>
                    </a>
                  ))}
                  
                  {sources.length === 0 && (
                     <p className="text-sm text-slate-400 italic">No direct sources linked for this summary.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
