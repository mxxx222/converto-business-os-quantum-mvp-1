'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Upload, Receipt, Calculator, Scale, Trophy, Zap, FileText, Download, Eye, Trash2 } from 'lucide-react';

interface ReceiptData {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  category: string;
  vat: number;
  imageUrl?: string;
}

export default function Dashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState('receipts');
  const [isUploading, setIsUploading] = useState(false);
  const [receipts, setReceipts] = useState<ReceiptData[]>([
    {
      id: '1',
      vendor: 'K-Market',
      amount: 24.50,
      date: '2024-10-27',
      category: 'Ruoka',
      vat: 4.90,
    },
    {
      id: '2',
      vendor: 'Shell',
      amount: 45.20,
      date: '2024-10-26',
      category: 'Polttoaine',
      vat: 9.04,
    },
    {
      id: '3',
      vendor: 'Office Depot',
      amount: 89.90,
      date: '2024-10-25',
      category: 'Toimisto',
      vat: 17.98,
    }
  ]);

  const stats = {
    receipts: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amount, 0),
    vatSaved: receipts.reduce((sum, r) => sum + r.vat, 0),
    points: 1250,
    streak: 7,
    level: 3
  };

  const tabs = [
    { id: 'receipts', label: 'Kuitit', icon: Receipt },
    { id: 'calculator', label: 'ALV-laskuri', icon: Calculator },
    { id: 'legal', label: 'Lakineuvonta', icon: Scale },
    { id: 'gamification', label: 'Pisteet', icon: Trophy }
  ];

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '';
        const endpoint = `${apiBase}/api/v1/ocr/power`;
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const newReceipt: ReceiptData = {
            id: Date.now().toString(),
            vendor: result.vendor || 'Tuntematon',
            amount: result.amount || 0,
            date: result.date || new Date().toISOString().split('T')[0],
            category: result.category || 'Muu',
            vat: result.vat || 0,
          };
          setReceipts(prev => [newReceipt, ...prev]);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">CONVERTO</h1>
                <p className="text-sm text-slate-600">Business OS Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Pisteet</p>
                <p className="text-xl font-bold text-primary-600">{stats.points.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🏆</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Kuitit</p>
                <p className="text-2xl font-bold text-slate-900">{stats.receipts}</p>
              </div>
              <Receipt className="w-8 h-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Kokonaissumma</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalAmount.toLocaleString('fi-FI')} €</p>
              </div>
              <Calculator className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">ALV säästö</p>
                <p className="text-2xl font-bold text-green-600">{stats.vatSaved.toLocaleString('fi-FI')} €</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Streak</p>
                <p className="text-2xl font-bold text-red-600">{stats.streak} päivää</p>
              </div>
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'receipts' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary-400 transition-colors"
                >
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Lataa kuitit OCR-skannaukseen</h3>
                  <p className="text-slate-600 mb-6">Vedä ja pudota kuitit tähän tai klikkaa valitaksesi tiedostot</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-primary px-6 py-3 cursor-pointer inline-block"
                  >
                    {isUploading ? 'Ladataan...' : 'Valitse tiedostot'}
                  </label>
                </div>

                {/* Receipts List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Viimeisimmät kuitit</h3>
                  {receipts.map((receipt) => (
                    <motion.div
                      key={receipt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{receipt.vendor}</h4>
                          <p className="text-sm text-slate-600">{receipt.date} • {receipt.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{receipt.amount.toLocaleString('fi-FI')} €</p>
                          <p className="text-sm text-green-600">ALV: {receipt.vat.toLocaleString('fi-FI')} €</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-slate-400 hover:text-slate-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'calculator' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">ALV-laskuri</h3>
                  <p className="text-slate-600 mb-6">Laske ALV automaattisesti Suomen verokäytäntöjen mukaan</p>
                  <button className="btn-primary px-6 py-3">
                    Avaa laskuri
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'legal' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-12">
                  <Scale className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Lakineuvonta</h3>
                  <p className="text-slate-600 mb-6">Kysy verotuksesta ja liiketoiminnan laillisuudesta</p>
                  <button className="btn-primary px-6 py-3">
                    Kysy lakiasiantuntijalta
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'gamification' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Gamification</h3>
                  <p className="text-slate-600 mb-6">Ansaitse pisteitä ja nouse tasoissa!</p>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.points}</div>
                      <div className="text-sm text-slate-600">Pisteet</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.streak}</div>
                      <div className="text-sm text-slate-600">Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.level}</div>
                      <div className="text-sm text-slate-600">Taso</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
