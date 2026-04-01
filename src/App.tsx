import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Trash,
  QrCode, 
  Package, 
  MapPin, 
  Layers, 
  ChevronDown, 
  ChevronRight,
  X,
  RefreshCw,
  Download,
  Printer,
  Save,
  Paperclip,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Camera,
  Scan,
  Sun,
  Moon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { WarehouseItem, ItemFormData, Location, Category } from './types';
import { cn } from './lib/utils';
import { initialItems } from './data/initialItems';

// --- Components ---

const ItemCard: React.FC<{ 
  item: WarehouseItem; 
  onEdit: (item: WarehouseItem) => void; 
  onDelete: (item: WarehouseItem) => void; 
  onViewQR: (item: WarehouseItem) => void;
  onViewDetails: (item: WarehouseItem) => void;
}> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onViewQR,
  onViewDetails
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    onClick={() => onViewDetails(item)}
    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden group h-full flex flex-col cursor-pointer"
  >
    {(item.imageUrls?.[0] || item.imageUrl) && (
      <div className="relative h-48 overflow-hidden bg-white dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center">
        <img 
          src={item.imageUrls?.[0] || item.imageUrl} 
          alt={item.name}
          referrerPolicy="no-referrer"
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
        />
      </div>
    )}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
              {item.category || 'Без категории'}
            </span>
            {item.subclass && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                {item.subclass}
              </span>
            )}
            {item.sku && (
              <span className="text-slate-400 dark:text-slate-500 text-xs font-mono">{item.sku}</span>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onViewQR(item); }}
              className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-800 shadow-sm shrink-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              title="Показать QR-код"
            >
              <QRCodeSVG 
                value={item.sku || item.id}
                size={16}
                level="L"
              />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{item.name}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Наличие</p>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xl font-bold",
              item.quantity <= (item.minQuantity ?? 5) ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"
            )}>
              {item.quantity}
            </span>
            {item.quantity <= (item.minQuantity ?? 5) && <AlertCircle size={16} className="text-amber-500" />}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Локация</p>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
            <span className="truncate">{item.location || '—'}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 min-h-[2.5rem]">
        {item.description || 'Нет описания'}
      </p>

      <div className="flex flex-wrap gap-y-2 gap-x-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        {item.specs && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 w-full">
            <span className="text-slate-400 uppercase text-[9px]">Характеристики:</span>
            <span className="truncate">{item.specs}</span>
          </div>
        )}
        {item.weight && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="text-slate-400 uppercase text-[9px]">Вес:</span>
            <span>{item.weight}</span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Сверка:</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{item.lastChecked || '—'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Обновлено: {new Date(item.updatedAt).toLocaleDateString()}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item); }}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
              title="Закрыть (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const QRScanner = ({ onScan, onClose, isPaused = false, isFloating = false }: { onScan: (data: string) => string | null; onClose: () => void; isPaused?: boolean; isFloating?: boolean }) => {
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number | null>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanSuccess, setIsScanSuccess] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const onScanRef = useRef(onScan);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const handlePauseResume = async () => {
      if (scannerRef.current && isCameraStarted) {
        try {
          if (isPaused) {
            await scannerRef.current.pause();
          } else {
            // If we're resuming from a successful scan, reset the states
            if (isScanSuccess) {
              setIsScanSuccess(false);
              setScannedResult(null);
              isProcessingRef.current = false;
            }
            await scannerRef.current.resume();
          }
        } catch (err) {
          console.error("Scanner pause/resume error:", err);
        }
      }
    };
    handlePauseResume();
  }, [isPaused, isCameraStarted, isScanSuccess]);

  const initCameras = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      const devices = await Html5Qrcode.getCameras();
      if (!isMountedRef.current) return;
      
      // Try to find the back cameras
      const backCameras = devices.filter(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('задняя') ||
        device.label.toLowerCase().includes('environment') ||
        device.label.toLowerCase().includes('основная') ||
        device.label.toLowerCase().includes('внешняя')
      );

      if (backCameras.length > 0) {
        setCameras(backCameras);
        setCurrentCameraIndex(0);
      } else {
        setCameras(devices);
        if (devices.length > 0) {
          setCurrentCameraIndex(0);
        } else {
          // No cameras found, but we can still try facingMode: environment
          startScanner();
        }
      }
    } catch (err) {
      console.error("Camera detection error:", err);
      // Even if detection fails, try starting with default facingMode
      if (isMountedRef.current) {
        startScanner();
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    initCameras();

    return () => {
      isMountedRef.current = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [initCameras]);

  useEffect(() => {
    if (currentCameraIndex !== null) {
      startScanner();
    }
  }, [currentCameraIndex]);

  const startScanner = async () => {
    if (!isMountedRef.current || isInitializing) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          console.warn("Scanner stop error (safe to ignore):", e);
        }
        scannerRef.current = null;
      }

      // Ensure DOM element is ready
      await new Promise(r => setTimeout(r, 800));
      if (!isMountedRef.current) return;

      const elementId = "qr-reader";
      const scanner = new Html5Qrcode(elementId, { verbose: false });
      scannerRef.current = scanner;

      const config = { 
        fps: 20,
        qrbox: { width: 300, height: 300 },
        aspectRatio: 1.0,
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
      };

      // Try with specific camera if selected, otherwise try environment, then fallback to any
      let source: any = { facingMode: "environment" };
      if (cameras.length > 0 && currentCameraIndex !== null && cameras[currentCameraIndex]) {
        source = { deviceId: cameras[currentCameraIndex].id };
      }

      try {
        await scanner.start(
          source,
          config,
          (text) => {
            if (isMountedRef.current && !isProcessingRef.current) {
              isProcessingRef.current = true;
              
              if (window.navigator.vibrate) {
                window.navigator.vibrate(100);
              }

              const resultName = onScanRef.current(text);
              if (resultName) {
                setScannedResult(resultName);
                setIsScanSuccess(true);
                scannerRef.current?.pause().catch(() => {});
              } else {
                setTimeout(() => {
                  isProcessingRef.current = false;
                }, 2000);
              }
            }
          },
          () => {}
        );
      } catch (startErr: any) {
        console.warn("Primary scanner start failed, trying fallback:", startErr);
        // If specific source failed, try any available camera
        if (isMountedRef.current) {
          await scanner.start(
            { facingMode: "user" }, // Try front camera as fallback
            config,
            (text) => { /* same callback */ },
            () => {}
          ).catch(async () => {
            // Last resort: just start with whatever is available
            return await scanner.start({}, config, () => {}, () => {});
          });
        }
      }

      if (isMountedRef.current) {
        setIsCameraStarted(true);
        setIsInitializing(false);
      }
    } catch (err: any) {
      console.error("Scanner start error:", err);
      if (isMountedRef.current) {
        let msg = "Ошибка запуска камеры";
        if (err.name === "NotAllowedError") msg = "Доступ к камере запрещен. Пожалуйста, разрешите доступ в настройках браузера.";
        else if (err.name === "NotFoundError") msg = "Камера не найдена на этом устройстве.";
        else if (err.name === "NotReadableError") msg = "Камера уже используется другим приложением или вкладкой.";
        else if (err.message) msg = `Ошибка: ${err.message}`;
        
        setError(msg);
        setIsInitializing(false);
        setIsCameraStarted(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 flex justify-between items-center pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          {cameras.length > 1 && (
            <button 
              onClick={() => {
                setCurrentCameraIndex(prev => (prev === null ? 0 : (prev + 1) % cameras.length));
              }}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95"
              title="Переключить камеру"
            >
              <RefreshCw size={24} className={isInitializing ? "animate-spin" : ""} />
            </button>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95 pointer-events-auto"
          aria-label="Закрыть сканер"
        >
          <X size={24} />
        </button>
      </div>

      <div id="qr-reader" ref={containerRef} className="flex-1 w-full h-full relative">
        {isCameraStarted && !isInitializing && (
          <div className="absolute inset-0 pointer-events-none z-[50] flex items-center justify-center">
            {/* Scan Area Highlight */}
            <div className="w-[300px] h-[300px] border-2 border-blue-500/50 rounded-2xl relative overflow-hidden">
              {/* Pulsing Corners */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-lg animate-pulse" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-lg animate-pulse" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-lg animate-pulse" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-lg animate-pulse" />
              
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_2s_linear_infinite]" />
            </div>
            
            {/* Status Label - Only show when detected or processing */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center">
              <AnimatePresence mode="wait">
                {isScanSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-6 py-3 bg-green-500/90 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center gap-1 shadow-2xl"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-white" />
                      <span className="text-white text-sm font-bold uppercase tracking-widest">Найдено!</span>
                    </div>
                    <span className="text-white text-xs opacity-90 font-medium truncate max-w-[200px]">{scannedResult}</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium uppercase tracking-widest opacity-60">Наведите на QR-код</span>
                    </div>
                    <p className="text-white/40 text-[10px] font-medium uppercase tracking-tighter text-center max-w-[200px]">
                      Обеспечьте хорошее освещение и держите код в центре рамки
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {!isCameraStarted && !isInitializing && error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center z-[100]">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Ошибка камеры</h3>
          <p className="text-slate-400 mb-6 text-sm">{error}</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button 
              onClick={() => initCameras()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-900/20 transition-all active:scale-95"
            >
              Попробовать снова
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {isInitializing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-[200]">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-white font-medium mb-6">Инициализация камеры...</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            Отмена
          </button>
        </div>
      )}

      <style>{`
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        #qr-reader canvas {
          display: none !important;
        }
        #qr-reader__status_span {
          display: none !important;
        }
        #qr-reader__dashboard {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

const ItemForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  categories,
  existingLocations,
  onAddLocation
}: { 
  initialData?: WarehouseItem; 
  onSubmit: (data: ItemFormData) => void; 
  onCancel: () => void;
  categories: Category[];
  existingLocations: string[];
  onAddLocation?: () => void;
}) => {
  const [formData, setFormData] = useState<ItemFormData>(() => {
    const data = initialData || {
      name: '',
      sku: '',
      quantity: 0,
      minQuantity: 5,
      specs: '',
      category: '',
      subclass: '',
      location: '',
      description: '',
      lastChecked: '',
      imageUrl: '',
      imageUrls: []
    };
    // Migrate single imageUrl to imageUrls if needed
    if (data.imageUrl && (!data.imageUrls || data.imageUrls.length === 0)) {
      data.imageUrls = [data.imageUrl];
    }
    return data;
  });

  const selectedCategoryData = categories.find(c => c.name === formData.category);
  const subclassesForCategory = selectedCategoryData ? selectedCategoryData.subclasses : [];

  const handleAddImageUrl = () => {
    if ((formData.imageUrls?.length || 0) < 3) {
      setFormData({
        ...formData,
        imageUrls: [...(formData.imageUrls || []), '']
      });
    }
  };

  const handleUpdateImageUrl = (index: number, value: string) => {
    const newUrls = [...(formData.imageUrls || [])];
    newUrls[index] = value;
    setFormData({ ...formData, imageUrls: newUrls, imageUrl: newUrls[0] || '' });
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleUpdateImageUrl(index, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    const newUrls = (formData.imageUrls || []).filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newUrls, imageUrl: newUrls[0] || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-4 pb-6">
        <div className="mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Основная информация</span>
        </div>
        
        <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Наименование</label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
          placeholder="Напр. Болт М10"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Артикул (SKU)</label>
          <input
            type="text"
            value={formData.sku}
            onChange={e => setFormData({ ...formData, sku: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
            placeholder="SKU-001"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Количество</label>
          <input
            required
            type="number"
            min="0"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Мин. остаток</label>
          <input
            required
            type="number"
            min="0"
            value={formData.minQuantity ?? 5}
            onChange={e => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Характеристики (напр. полярность, вольтаж)</label>
        <input
          type="text"
          value={formData.specs || ''}
          onChange={e => setFormData({ ...formData, specs: e.target.value })}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
          placeholder="5V, Обратная полярность..."
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Изображения (до 3-х)</label>
          {(formData.imageUrls?.length || 0) < 3 && (
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <Plus size={12} /> ДОБАВИТЬ ФОТО
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {(formData.imageUrls || []).map((url, index) => (
            <div key={index} className="flex gap-3 items-start group">
              <div className="flex-1 space-y-1">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={e => handleUpdateImageUrl(index, e.target.value)}
                    className="w-full pl-4 pr-20 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100 text-sm"
                    placeholder="URL или загрузите файл..."
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <label className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer" title="Загрузить файл">
                      <Paperclip size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(index, e)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Удалить изображение"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
              {url && (
                <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white shrink-0 shadow-sm">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          ))}
          
          {(formData.imageUrls?.length || 0) === 0 && (
            <div 
              onClick={handleAddImageUrl}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-900 transition-all group"
            >
              <Camera className="mx-auto text-slate-300 group-hover:text-blue-400 mb-1" size={24} />
              <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest">Нажмите, чтобы добавить фото</p>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Категория</label>
          <input
            type="text"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
            placeholder="Крепеж"
            list="categories-list"
          />
          <datalist id="categories-list">
            {categories.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Подкласс</label>
          <input
            type="text"
            value={formData.subclass}
            onChange={e => setFormData({ ...formData, subclass: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
            placeholder="Метизы"
            list="subclasses-list"
          />
          <datalist id="subclasses-list">
            {subclassesForCategory.map((s, idx) => <option key={`${s}-${idx}`} value={s} />)}
          </datalist>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Дата сверки</label>
          <input
            type="text"
            value={formData.lastChecked || ''}
            onChange={e => setFormData({ ...formData, lastChecked: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
            placeholder="ДД.ММ.ГГГГ"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Местоположение</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
              placeholder="Без локации"
              list="locations-list"
            />
            <datalist id="locations-list">
              {existingLocations.sort().map((l, idx) => (
                <option key={`${l}-${idx}`} value={l} />
              ))}
            </datalist>
            {onAddLocation && (
              <button
                type="button"
                onClick={onAddLocation}
                className="flex items-center justify-center w-10 h-[42px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
                title="Добавить новую локацию"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Описание</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none dark:text-slate-100"
          placeholder="Дополнительная информация..."
        />
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
        >
          <X size={18} />
          Выход
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <Save size={18} />
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};

const ItemDetails: React.FC<{ 
  item: WarehouseItem; 
  onClose: () => void;
  onEdit: (item: WarehouseItem) => void;
  onDelete: (item: WarehouseItem) => void;
}> = ({ item, onClose, onEdit, onDelete }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = useMemo(() => {
    const allImages = [...(item.imageUrls || [])];
    if (item.imageUrl && !allImages.includes(item.imageUrl)) {
      allImages.unshift(item.imageUrl);
    }
    return allImages.filter(Boolean);
  }, [item.imageUrl, item.imageUrls]);

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="relative h-48 sm:h-64 overflow-hidden bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            <img 
              src={images[activeImageIndex]} 
              alt={item.name}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain drop-shadow-md"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto py-1 custom-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "w-12 h-12 rounded-lg border-2 overflow-hidden bg-white shrink-0 transition-all",
                    activeImageIndex === idx ? "border-blue-500 scale-110 shadow-md" : "border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Артикул</p>
          <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">{item.sku || '—'}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">QR-код</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate max-w-[80px]">{item.id}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
            <QRCodeSVG 
              value={item.sku || item.id}
              size={40}
              level="L"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Наличие</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {item.quantity}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Локация</p>
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
            <MapPin size={16} className="text-slate-400" />
            <span>{item.location || '—'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Layers className="text-slate-400 mt-1 shrink-0" size={18} />
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Категория / Подкласс</p>
            <p className="text-slate-900 dark:text-slate-100 font-medium">{item.category} {item.subclass && ` / ${item.subclass}`}</p>
          </div>
        </div>

      {item.specs && (
        <div className="flex items-start gap-3">
          <AlertCircle className="text-slate-400 mt-1 shrink-0" size={18} />
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Характеристики</p>
            <p className="text-slate-900 dark:text-slate-100 font-medium">{item.specs}</p>
          </div>
        </div>
      )}
    </div>

    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Описание</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {item.description || 'Описание отсутствует.'}
      </p>
    </div>

    <div className="flex flex-col gap-3 pt-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => { onEdit(item); }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-bold"
        >
          <Edit2 size={18} />
          Редактировать
        </button>
        <button
          onClick={() => { onDelete(item); }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all font-bold"
        >
          <Trash2 size={18} />
          Удалить
        </button>
      </div>
      <button
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold"
      >
        <X size={18} />
        Закрыть
      </button>
    </div>
  </div>
  );
};

// --- Main App ---

const DATA_VERSION = '1.7'; // Версия данных для принудительного обновления при изменении базы

export default function App() {
  const generateId = () => Math.random().toString(36).substring(2, 11);

  const [items, setItems] = useState<WarehouseItem[]>(() => {
    const saved = localStorage.getItem('warehouse_items');
    const savedVersion = localStorage.getItem('warehouse_data_version');
    
    // Если версия совпадает и данные есть - загружаем из памяти
    if (saved && savedVersion === DATA_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
    
    // Иначе (первый запуск или обновление базы) - загружаем начальные данные
    localStorage.setItem('warehouse_data_version', DATA_VERSION);
    return initialItems;
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('warehouse_locations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse saved locations", e);
      }
    }
    
    // Инициализируем из текущих товаров, если пусто
    const uniqueLocations = Array.from(new Set(initialItems.map(i => i.location).filter(Boolean)));
    return uniqueLocations.map(name => ({
      id: Math.random().toString(36).substring(2, 11),
      name,
      updatedAt: Date.now()
    }));
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('warehouse_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse saved categories", e);
      }
    }
    
    // Инициализируем из текущих товаров, если пусто
    const uniqueCategories = Array.from(new Set(initialItems.map(i => i.category).filter(Boolean)));
    return uniqueCategories.map(name => ({
      id: Math.random().toString(36).substring(2, 11),
      name,
      subclasses: Array.from(new Set(initialItems.filter(i => i.category === name).map(i => i.subclass).filter(Boolean))),
      updatedAt: Date.now()
    }));
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFinalized, setIsSearchFinalized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState<Partial<ItemFormData> | null>(null);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [viewingItem, setViewingItem] = useState<WarehouseItem | null>(null);
  const [viewingQR, setViewingQR] = useState<WarehouseItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<WarehouseItem | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'updatedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'total' | 'low'>('total');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [locationToRename, setLocationToRename] = useState<string | null>(null);
  const [newLocationName, setNewLocationName] = useState('');
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [addCategoryInput, setAddCategoryInput] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToRename, setCategoryToRename] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [isAddingSubclass, setIsAddingSubclass] = useState<string | null>(null); // category name
  const [addSubclassInput, setAddSubclassInput] = useState('');
  const [subclassToDelete, setSubclassToDelete] = useState<{category: string, subclass: string} | null>(null);
  const [subclassToRename, setSubclassToRename] = useState<{category: string, subclass: string} | null>(null);
  const [newSubclassName, setNewSubclassName] = useState('');
  const [addLocationInput, setAddLocationInput] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('warehouse_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('warehouse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('warehouse_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('warehouse_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('warehouse_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    if (isCategoryModalOpen && selectedCategory) {
      setExpandedCategories(prev => 
        prev.includes(selectedCategory) ? prev : [...prev, selectedCategory]
      );
    }
  }, [isCategoryModalOpen, selectedCategory]);

  const handleAddItem = (data: ItemFormData) => {
    // Добавляем новую локацию, если её нет в списке
    if (data.location && !locations.some(l => l.name === data.location)) {
      handleAddLocation(data.location);
    }
    
    const newItem: WarehouseItem = {
      ...data,
      id: generateId(),
      updatedAt: Date.now()
    };
    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    setPrefilledData(null);
    setViewingQR(newItem);
  };

  const handleEditItem = (data: ItemFormData) => {
    if (!editingItem) return;
    
    // Добавляем новую локацию, если её нет в списке
    if (data.location && !locations.some(l => l.name === data.location)) {
      handleAddLocation(data.location);
    }

    const updatedItem = { ...editingItem, ...data, updatedAt: Date.now() };
    setItems(items.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    if (viewingItem?.id === editingItem.id) {
      setViewingItem(updatedItem);
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setItemToDelete(null);
    setViewingItem(null);
  };

  const handleRenameLocation = (oldName: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName || oldName === trimmedNewName || locations.some(l => l.name === trimmedNewName)) {
      setLocationToRename(null);
      return;
    }
    
    // Обновляем товары
    setItems(items.map(item => 
      item.location === oldName ? { ...item, location: trimmedNewName, updatedAt: Date.now() } : item
    ));
    
    // Обновляем список локаций
    setLocations(locations.map(loc => 
      loc.name === oldName ? { ...loc, name: trimmedNewName, updatedAt: Date.now() } : loc
    ));

    if (selectedLocation === oldName) setSelectedLocation(trimmedNewName);
    setLocationToRename(null);
    setNewLocationName('');
  };

  const handleAddLocation = (name: string) => {
    if (!name.trim() || locations.some(l => l.name === name)) return;
    const newLoc: Location = {
      id: generateId(),
      name: name.trim(),
      updatedAt: Date.now()
    };
    setLocations([newLoc, ...locations]);
  };

  const handleDeleteLocation = (name: string) => {
    setItems(items.map(item => 
      item.location === name ? { ...item, location: '', updatedAt: Date.now() } : item
    ));
    setLocations(locations.filter(l => l.name !== name));
    if (selectedLocation === name) setSelectedLocation(null);
    setLocationToDelete(null);
  };

  const handleAddCategory = (name: string) => {
    if (!name.trim() || categories.some(c => c.name === name)) return;
    const newCat: Category = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim(),
      subclasses: [],
      updatedAt: Date.now()
    };
    setCategories([newCat, ...categories]);
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    if (!newName.trim() || categories.some(c => c.name === newName)) return;
    setItems(items.map(item => 
      item.category === oldName ? { ...item, category: newName.trim(), updatedAt: Date.now() } : item
    ));
    setCategories(categories.map(c => 
      c.name === oldName ? { ...c, name: newName.trim(), updatedAt: Date.now() } : c
    ));
    if (selectedCategory === oldName) setSelectedCategory(newName.trim());
    setCategoryToRename(null);
  };

  const handleDeleteCategory = (name: string) => {
    setItems(items.map(item => 
      item.category === name ? { ...item, category: '', subclass: '', updatedAt: Date.now() } : item
    ));
    setCategories(categories.filter(c => c.name !== name));
    if (selectedCategory === name) {
      setSelectedCategory(null);
      setSelectedSubclass(null);
    }
    setCategoryToDelete(null);
  };

  const handleAddSubclass = (categoryName: string, subName: string) => {
    if (!subName.trim()) return;
    setCategories(categories.map(c => {
      if (c.name === categoryName) {
        if (c.subclasses.includes(subName.trim())) return c;
        return { ...c, subclasses: [...c.subclasses, subName.trim()], updatedAt: Date.now() };
      }
      return c;
    }));
  };

  const handleRenameSubclass = (categoryName: string, oldSub: string, newSub: string) => {
    const trimmedNewSub = newSub.trim();
    if (!trimmedNewSub || oldSub === trimmedNewSub) {
      setSubclassToRename(null);
      return;
    }

    // Проверяем на дубликаты в этой категории
    const category = categories.find(c => c.name === categoryName);
    if (category?.subclasses.includes(trimmedNewSub)) {
      setSubclassToRename(null);
      return;
    }

    setItems(items.map(item => 
      (item.category === categoryName && item.subclass === oldSub) 
        ? { ...item, subclass: trimmedNewSub, updatedAt: Date.now() } 
        : item
    ));
    setCategories(categories.map(c => {
      if (c.name === categoryName) {
        return { 
          ...c, 
          subclasses: c.subclasses.map(s => s === oldSub ? trimmedNewSub : s),
          updatedAt: Date.now() 
        };
      }
      return c;
    }));
    if (selectedCategory === categoryName && selectedSubclass === oldSub) setSelectedSubclass(trimmedNewSub);
    setSubclassToRename(null);
  };

  const handleDeleteSubclass = (categoryName: string, subName: string) => {
    setItems(items.map(item => 
      (item.category === categoryName && item.subclass === subName) 
        ? { ...item, subclass: '', updatedAt: Date.now() } 
        : item
    ));
    setCategories(categories.map(c => {
      if (c.name === categoryName) {
        return { 
          ...c, 
          subclasses: c.subclasses.filter(s => s !== subName),
          updatedAt: Date.now() 
        };
      }
      return c;
    }));
    if (selectedCategory === categoryName && selectedSubclass === subName) setSelectedSubclass(null);
    setSubclassToDelete(null);
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = items
      .filter(item => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        if (isSearchFinalized) {
          return (
            item.name.toLowerCase() === query ||
            (item.sku?.toLowerCase() || '') === query ||
            item.category.toLowerCase() === query ||
            item.subclass.toLowerCase() === query ||
            item.location.toLowerCase() === query
          );
        }

        return (
          item.name.toLowerCase().includes(query) ||
          (item.sku?.toLowerCase() || '').includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subclass.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      });

    if (activeTab === 'low') {
      result = result.filter(item => item.quantity <= (item.minQuantity ?? 5));
    }

    if (selectedCategory !== null) {
      result = result.filter(item => (item.category || '') === selectedCategory);
    }

    if (selectedSubclass !== null) {
      result = result.filter(item => (item.subclass || '') === selectedSubclass);
    }

    if (selectedLocation !== null) {
      result = result.filter(item => (item.location || '') === selectedLocation);
    }

    return result.sort((a, b) => {
      const factor = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * factor;
      
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * factor;
      }
      return 0;
    });
  }, [items, searchQuery, sortBy, sortOrder, activeTab]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || isSearchFinalized) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const suggestions = new Set<string>();
    
    items.forEach(item => {
      if (item.name.toLowerCase().includes(query)) suggestions.add(item.name);
      if (item.sku?.toLowerCase().includes(query)) suggestions.add(item.sku);
      if (item.category.toLowerCase().includes(query)) suggestions.add(item.category);
      if (item.subclass.toLowerCase().includes(query)) suggestions.add(item.subclass);
      if (item.location.toLowerCase().includes(query)) suggestions.add(item.location);
    });
    
    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  }, [items, searchQuery, isSearchFinalized]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setIsSearchFinalized(false);
    setShowSuggestions(true);
  };

  const finalizeSearch = useCallback((val?: string) => {
    if (val !== undefined) setSearchQuery(val);
    setIsSearchFinalized(true);
    setShowSuggestions(false);
  }, []);

  const toggleSort = (field: 'name' | 'quantity' | 'updatedAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleQRScan = useCallback((decodedText: string): string | null => {
    const cleanText = decodedText.trim();
    const lowerText = cleanText.toLowerCase();

    // 1. First, try to find by SKU, ID or Name directly (case-insensitive)
    const item = items.find(i => 
      i.sku?.toLowerCase() === lowerText || 
      i.id?.toLowerCase() === lowerText || 
      i.name?.toLowerCase() === lowerText
    );

    if (item) {
      setViewingItem(item);
      return item.name;
    }

    // 2. If not found, try to parse as JSON (for backward compatibility or complex codes)
    try {
      const data = JSON.parse(cleanText);
      
      // If it has an ID or SKU, try to find it
      const jsonItem = items.find(i => 
        (data.id && i.id === data.id) || 
        (data.sku && i.sku === data.sku) ||
        (data.name && i.name.toLowerCase() === data.name.toLowerCase())
      );

      if (jsonItem) {
        setViewingItem(jsonItem);
        return jsonItem.name;
      }

      // If it's a valid JSON but item not found, it might be a new item template
      if (data.sku || data.name) {
        setPrefilledData({
          name: data.name || '',
          sku: data.sku || cleanText,
          category: data.category || '',
          subclass: data.subclass || '',
          location: data.location || '',
          quantity: data.quantity || 0,
          minQuantity: data.minQuantity || 5,
          specs: data.specs || '',
          description: data.description || '',
          lastChecked: data.lastChecked || '',
          imageUrl: data.imageUrl || ''
        });
        setIsAddModalOpen(true);
        return data.name || "Новая позиция";
      }
    } catch (e) {
      // Not JSON, that's fine
    }

    // 3. If no exact match and not a valid item JSON, use as search query
    setSearchQuery(cleanText);
    setIsSearchFinalized(true);
    
    // Check if we have any partial matches
    const partialMatches = items.filter(i => 
      i.name.toLowerCase().includes(lowerText) || 
      i.sku?.toLowerCase().includes(lowerText)
    );

    if (partialMatches.length === 0) {
      return "Ничего не найдено";
    }
    
    return `Поиск: ${cleanText}`;
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="bg-transparent sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">Складской Помощник</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Система управления ТМЦ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                title={theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Сбросить данные"
              >
                <X size={20} />
              </button>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl transition-all font-medium"
              >
                <Scan size={20} />
                <span className="hidden sm:inline">Сканировать QR</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all font-medium"
              >
                <Plus size={20} />
                <span>Добавить товар</span>
              </button>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="sm:hidden bg-blue-600 p-2 rounded-full text-white shadow-lg"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex items-center gap-4">
          <div className="relative flex-1 w-full" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Поиск по названию, SKU, категории..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') finalizeSearch();
              }}
              className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-100"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 overflow-hidden"
                >
                  {searchSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => finalizeSearch(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                      <Search size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{suggestion}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => finalizeSearch()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
          >
            Найти
          </button>
        </div>

        {/* Dashboard Summary / Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div 
            onClick={() => { setActiveTab('total'); setSelectedLocation(null); setSelectedCategory(null); }}
            className={cn(
              "bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group",
              activeTab === 'total' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
            )}
          >
            {activeTab === 'total' && (
              <motion.div layoutId="activeGlow" className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/20 -z-10" />
            )}
            <div className="flex items-center justify-between mb-2">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                activeTab === 'total' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
              )}>Всего позиций</p>
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                activeTab === 'total' ? "bg-blue-600 text-white" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              )}>
                <Layers size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{items.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between opacity-80">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Общее кол-во</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                <Package className="text-indigo-600 dark:text-indigo-400" size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 truncate">
              {items.reduce((acc, item) => acc + item.quantity, 0).toLocaleString()}
            </p>
          </div>
          <div 
            onClick={() => setActiveTab('low')}
            className={cn(
              "bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group",
              activeTab === 'low' ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700"
            )}
          >
            {activeTab === 'low' && (
              <motion.div layoutId="activeGlow" className="absolute inset-0 bg-amber-50/50 dark:bg-amber-900/20 -z-10" />
            )}
            <div className="flex items-center justify-between mb-2">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                activeTab === 'low' ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"
              )}>Низкий остаток</p>
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                activeTab === 'low' ? "bg-amber-600 text-white" : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              )}>
                <AlertCircle size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
              {items.filter(i => i.quantity <= (i.minQuantity ?? 5)).length}
            </p>
          </div>
          <div 
            onClick={() => setIsCategoryModalOpen(true)}
            className={cn(
              "bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group",
              selectedCategory ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700"
            )}
          >
            {selectedCategory && (
              <motion.div layoutId="activeGlow" className="absolute inset-0 bg-emerald-50/50 dark:bg-emerald-900/20 -z-10" />
            )}
            <div className="flex items-center justify-between mb-2">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                selectedCategory ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
              )}>Категорий</p>
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                selectedCategory ? "bg-emerald-600 text-white" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              )}>
                <Layers size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {new Set(items.map(i => i.category)).size}
            </p>
          </div>
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className={cn(
              "bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group",
              selectedLocation ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
            )}
          >
            {selectedLocation && (
              <motion.div layoutId="activeGlow" className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-900/20 -z-10" />
            )}
            <div className="flex items-center justify-between mb-2">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                selectedLocation ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              )}>Локаций</p>
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                selectedLocation ? "bg-indigo-600 text-white" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
              )}>
                <MapPin size={16} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {locations.length}
            </p>
          </div>
        </div>

        {/* Filters Indicator */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory !== null && (
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-2 px-3 rounded-xl">
              <Layers size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">{selectedCategory || 'Без категории'}</span>
                {selectedSubclass !== null && (
                  <> / <span className="font-bold">{selectedSubclass || 'Без подкласса'}</span></>
                )}
              </span>
              <button 
                onClick={() => { setSelectedCategory(null); setSelectedSubclass(null); }}
                className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {selectedLocation !== null && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-2 px-3 rounded-xl">
              <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                Локация: <span className="font-bold">{selectedLocation || 'Без локации'}</span>
              </span>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            {activeTab === 'total' ? 'Все товары' : 'Критический остаток'}
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {filteredAndSortedItems.length}
            </span>
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button 
              onClick={() => toggleSort('name')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all",
                sortBy === 'name' ? "bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              Имя {sortBy === 'name' && <ArrowUpDown size={14} />}
            </button>
            <button 
              onClick={() => toggleSort('quantity')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all",
                sortBy === 'quantity' ? "bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              Кол-во {sortBy === 'quantity' && <ArrowUpDown size={14} />}
            </button>
            <button 
              onClick={() => toggleSort('updatedAt')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all",
                sortBy === 'updatedAt' ? "bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              Дата {sortBy === 'updatedAt' && <ArrowUpDown size={14} />}
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {selectedCategory && !selectedSubclass ? (
              // Grouped view by subclass
              Array.from(new Set(filteredAndSortedItems.map(i => i.subclass || 'Без подкласса')))
                .sort()
                .map(sub => {
                  const subItems = filteredAndSortedItems.filter(i => (i.subclass || 'Без подкласса') === sub);
                  return (
                    <div key={sub} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-800">
                          {sub}
                        </h3>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                      </div>
                      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subItems.map(item => (
                          <ItemCard 
                            key={item.id} 
                            item={item} 
                            onEdit={setEditingItem}
                            onDelete={setItemToDelete}
                            onViewQR={setViewingQR}
                            onViewDetails={setViewingItem}
                          />
                        ))}
                      </motion.div>
                    </div>
                  );
                })
            ) : (
              // Normal grid
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedItems.map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onEdit={setEditingItem}
                    onDelete={setItemToDelete}
                    onViewQR={setViewingQR}
                    onViewDetails={setViewingItem}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400 dark:text-slate-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Ничего не найдено</h3>
            <p className="text-slate-500 dark:text-slate-400">Попробуйте изменить параметры поиска или добавьте новый товар.</p>
          </div>
        )}
      </main>

      {/* Centered Scanner */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black">
          <div className="w-full h-full relative">
            <QRScanner 
              onScan={handleQRScan} 
              onClose={() => setIsScannerOpen(false)} 
              isPaused={!!viewingItem || !!editingItem || !!isAddModalOpen}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddModalOpen && (
          <Modal isOpen={true} onClose={() => { setIsAddModalOpen(false); setPrefilledData(null); }} title="Добавить новый товар">
            <ItemForm 
              initialData={prefilledData ? { ...prefilledData, id: '', updatedAt: 0 } as WarehouseItem : undefined}
              onSubmit={handleAddItem} 
              onCancel={() => { setIsAddModalOpen(false); setPrefilledData(null); }} 
              categories={categories}
              existingLocations={locations.map(l => l.name)}
              onAddLocation={() => {
                setIsAddingLocation(true);
                setIsLocationModalOpen(true);
              }}
            />
          </Modal>
        )}

        {viewingItem && (
          <Modal isOpen={true} onClose={() => setViewingItem(null)} title={viewingItem.name}>
            <ItemDetails 
              item={viewingItem} 
              onClose={() => setViewingItem(null)}
              onEdit={setEditingItem}
              onDelete={setItemToDelete}
            />
          </Modal>
        )}

        {editingItem && (
          <Modal isOpen={true} onClose={() => setEditingItem(null)} title="Редактировать товар">
            <ItemForm 
              initialData={editingItem} 
              onSubmit={handleEditItem} 
              onCancel={() => setEditingItem(null)} 
              categories={categories}
              existingLocations={locations.map(l => l.name)}
              onAddLocation={() => {
                setIsAddingLocation(true);
                setIsLocationModalOpen(true);
              }}
            />
          </Modal>
        )}

        {itemToDelete && (
          <Modal isOpen={true} onClose={() => setItemToDelete(null)} title="Удалить товар">
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-full text-rose-600 mb-2">
                <AlertCircle size={32} />
              </div>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-1">Вы уверены, что хотите удалить:</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{itemToDelete.name}?</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 font-mono">{itemToDelete.sku}</p>
              </div>
              <div className="flex gap-3 w-full mt-6">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => handleDeleteItem(itemToDelete.id)}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-medium shadow-lg shadow-rose-100 dark:shadow-none"
                >
                  Удалить
                </button>
              </div>
            </div>
          </Modal>
        )}

        {viewingQR && (
          <Modal isOpen={true} onClose={() => setViewingQR(null)} title="QR-код товара">
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-inner border border-slate-100 dark:border-slate-700">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={viewingQR.sku || viewingQR.id} 
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{viewingQR.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{viewingQR.sku}</p>
              </div>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => {
                    const svg = document.getElementById('qr-code-svg');
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      const img = new Image();
                      img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx?.drawImage(img, 0, 0);
                        const pngFile = canvas.toDataURL("image/png");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = `QR_${viewingQR.sku}.png`;
                        downloadLink.href = `${pngFile}`;
                        downloadLink.click();
                      };
                      img.src = "data:image/svg+xml;base64," + btoa(svgData);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all font-medium"
                >
                  <Download size={20} />
                  <span>Скачать PNG</span>
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                >
                  <Printer size={20} />
                  <span>Печать</span>
                </button>
              </div>
            </div>
          </Modal>
        )}

        {isCategoryModalOpen && (
          <Modal 
            isOpen={true} 
            onClose={() => {
              setIsCategoryModalOpen(false);
              setIsAddingCategory(false);
              setIsAddingSubclass(null);
            }} 
            title="Категории и подклассы"
          >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Add Category Section */}
              {isAddingCategory ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 space-y-3">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Новая категория</p>
                  <input
                    autoFocus
                    type="text"
                    value={addCategoryInput}
                    onChange={(e) => setAddCategoryInput(e.target.value)}
                    placeholder="Название категории..."
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-slate-100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory(addCategoryInput);
                        setAddCategoryInput('');
                        setIsAddingCategory(false);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsAddingCategory(false)}
                      className="flex-1 px-4 py-2 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors font-medium"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => {
                        handleAddCategory(addCategoryInput);
                        setAddCategoryInput('');
                        setIsAddingCategory(false);
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubclass(null);
                      setIsCategoryModalOpen(false);
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-between p-4 rounded-xl border transition-all",
                      selectedCategory === null ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                    )}
                  >
                    <span className="font-bold">Все категории</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">{items.length}</span>
                  </button>
                  <button
                    onClick={() => setIsAddingCategory(true)}
                    className="p-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    title="Добавить категорию"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              )}
              
              {/* Categories List */}
              {categories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(cat => {
                  const categoryItems = items.filter(i => i.category === cat.name);
                  const count = categoryItems.length;
                  const isExpanded = expandedCategories.includes(cat.name);
                  const isRenaming = categoryToRename === cat.name;

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex items-center gap-2 group">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCategories(prev => 
                              prev.includes(cat.name) 
                                ? prev.filter(c => c !== cat.name) 
                                : [...prev, cat.name]
                            );
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isExpanded ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                          )}
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        
                        {isRenaming ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-500 rounded-lg outline-none text-sm dark:text-slate-100"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameCategory(cat.name, newCategoryName);
                                if (e.key === 'Escape') setCategoryToRename(null);
                              }}
                            />
                            <button 
                              onClick={() => handleRenameCategory(cat.name, newCategoryName)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                              <Save size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setSelectedSubclass(null);
                              setIsCategoryModalOpen(false);
                            }}
                            className={cn(
                              "flex-1 flex items-center justify-between p-3 rounded-xl border transition-all text-left min-w-0",
                              (selectedCategory === cat.name && selectedSubclass === null) 
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" 
                                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                            )}
                          >
                            <span className="font-bold text-sm truncate">{cat.name}</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">{count}</span>
                          </button>
                        )}

                        {!isRenaming && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setCategoryToRename(cat.name);
                                setNewCategoryName(cat.name);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                              title="Переименовать"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat.name)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                              title="Удалить"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-6 grid grid-cols-1 gap-1 overflow-hidden border-l-2 border-emerald-100 dark:border-emerald-900/50 ml-5 mt-1 mb-2"
                          >
                            {cat.subclasses
                              .sort()
                              .map((sub, idx) => {
                                const subCount = categoryItems.filter(i => i.subclass === sub).length;
                                const isSubRenaming = subclassToRename?.category === cat.name && subclassToRename?.subclass === sub;

                                return (
                                  <div key={`${sub}-${idx}`} className="flex items-center gap-2 group/sub">
                                    {isSubRenaming ? (
                                      <div className="flex-1 flex gap-2 py-1">
                                        <input
                                          autoFocus
                                          type="text"
                                          value={newSubclassName}
                                          onChange={(e) => setNewSubclassName(e.target.value)}
                                          className="flex-1 px-3 py-1 bg-white dark:bg-slate-800 border border-emerald-400 rounded-lg outline-none text-xs dark:text-slate-100"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRenameSubclass(cat.name, sub, newSubclassName);
                                            if (e.key === 'Escape') setSubclassToRename(null);
                                          }}
                                        />
                                        <button 
                                          onClick={() => handleRenameSubclass(cat.name, sub, newSubclassName)}
                                          className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                        >
                                          <Save size={14} />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setSelectedCategory(cat.name);
                                          setSelectedSubclass(sub);
                                          setIsCategoryModalOpen(false);
                                        }}
                                        className={cn(
                                          "flex-1 flex items-center justify-between p-2 pl-4 rounded-lg border transition-all text-sm",
                                          (selectedCategory === cat.name && selectedSubclass === sub) 
                                            ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400" 
                                            : "bg-white dark:bg-slate-800 border-transparent hover:border-emerald-100 dark:hover:border-emerald-800 text-slate-500 dark:text-slate-400"
                                        )}
                                      >
                                        <span className="truncate">{sub}</span>
                                        <span className="text-[10px] bg-slate-50 dark:bg-slate-900/50 px-1.5 py-0.5 rounded text-slate-400 dark:text-slate-500">{subCount}</span>
                                      </button>
                                    )}

                                    {!isSubRenaming && (
                                      <div className="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => {
                                            setSubclassToRename({ category: cat.name, subclass: sub });
                                            setNewSubclassName(sub);
                                          }}
                                          className="p-1.5 text-slate-400 hover:text-blue-500 rounded transition-all"
                                          title="Переименовать"
                                        >
                                          <Edit2 size={14} />
                                        </button>
                                        <button
                                          onClick={() => setSubclassToDelete({ category: cat.name, subclass: sub })}
                                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-all"
                                          title="Удалить"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            
                            {/* Add Subclass Section */}
                            {isAddingSubclass === cat.name ? (
                              <div className="flex gap-2 py-1">
                                <input
                                  autoFocus
                                  type="text"
                                  value={addSubclassInput}
                                  onChange={(e) => setAddSubclassInput(e.target.value)}
                                  placeholder="Новый подкласс..."
                                  className="flex-1 px-3 py-1 bg-white dark:bg-slate-800 border border-emerald-300 rounded-lg outline-none text-xs dark:text-slate-100"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddSubclass(cat.name, addSubclassInput);
                                      setAddSubclassInput('');
                                      setIsAddingSubclass(null);
                                    }
                                  }}
                                />
                                <button 
                                  onClick={() => {
                                    handleAddSubclass(cat.name, addSubclassInput);
                                    setAddSubclassInput('');
                                    setIsAddingSubclass(null);
                                  }}
                                  className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                  <Plus size={14} />
                                </button>
                                <button 
                                  onClick={() => setIsAddingSubclass(null)}
                                  className="p-1 text-slate-400 hover:text-rose-500"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setIsAddingSubclass(cat.name)}
                                className="w-full flex items-center gap-2 p-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all uppercase tracking-wider"
                              >
                                <Plus size={12} /> Добавить подкласс
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

              {/* "Without Category" special case */}
              {items.some(i => !i.category) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubclass(null);
                    setIsCategoryModalOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                    selectedCategory === '' ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                  )}
                >
                  <span className="font-bold">Без категории</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">{items.filter(i => !i.category).length}</span>
                </button>
              )}
            </div>
          </Modal>
        )}

        {categoryToDelete && (
          <Modal isOpen={true} onClose={() => setCategoryToDelete(null)} title="Удалить категорию">
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-full text-rose-600 mb-2">
                <AlertCircle size={32} />
              </div>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-1">Удалить категорию:</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{categoryToDelete}?</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Все товары в этой категории останутся без категории.</p>
              </div>
              <div className="flex gap-3 w-full mt-6">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => handleDeleteCategory(categoryToDelete)}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-medium shadow-lg shadow-rose-100 dark:shadow-none"
                >
                  Удалить
                </button>
              </div>
            </div>
          </Modal>
        )}

        {subclassToDelete && (
          <Modal isOpen={true} onClose={() => setSubclassToDelete(null)} title="Удалить подкласс">
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-full text-rose-600 mb-2">
                <AlertCircle size={32} />
              </div>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-1">Удалить подкласс:</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{subclassToDelete.subclass}?</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">В категории: {subclassToDelete.category}</p>
              </div>
              <div className="flex gap-3 w-full mt-6">
                <button 
                  onClick={() => setSubclassToDelete(null)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => handleDeleteSubclass(subclassToDelete.category, subclassToDelete.subclass)}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-medium shadow-lg shadow-rose-100 dark:shadow-none"
                >
                  Удалить
                </button>
              </div>
            </div>
          </Modal>
        )}

        {isLocationModalOpen && (
          <Modal 
            isOpen={true} 
            onClose={() => {
              setIsLocationModalOpen(false);
              setIsAddingLocation(false);
              setLocationSearchQuery('');
            }} 
            title={isAddingLocation ? "Добавить новую локацию" : "Управление локациями"}
          >
            <div className="space-y-4">
              {isAddingLocation ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Название локации</label>
                    <input
                      type="text"
                      value={addLocationInput}
                      onChange={(e) => setAddLocationInput(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-100"
                      placeholder="Напр. Стеллаж B-2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddLocation(addLocationInput);
                          setAddLocationInput('');
                          setIsAddingLocation(false);
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsAddingLocation(false);
                        setAddLocationInput('');
                      }}
                      className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Выход
                    </button>
                    <button
                      onClick={() => {
                        handleAddLocation(addLocationInput);
                        setAddLocationInput('');
                        setIsAddingLocation(false);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Search and Add Header */}
                  <div className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                      <input
                        type="text"
                        placeholder="Поиск локации..."
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-100 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddingLocation(true)}
                      className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                      title="Добавить локацию"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {locationSearchQuery === '' && (
                      <button
                        onClick={() => {
                          setSelectedLocation(null);
                          setIsLocationModalOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                          selectedLocation === null ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                        )}
                      >
                        <span className="font-bold">Все локации</span>
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">{items.length}</span>
                      </button>
                    )}
                    
                    {locations
                      .filter(loc => loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(loc => {
                        const locItems = items.filter(i => i.location === loc.name);
                        const count = locItems.length;

                        return (
                          <div key={loc.id} className="flex items-center gap-2 group">
                            <button
                              onClick={() => {
                                setSelectedLocation(loc.name);
                                setIsLocationModalOpen(false);
                                setLocationSearchQuery('');
                              }}
                              className={cn(
                                "flex-1 flex items-center justify-between p-4 rounded-xl border transition-all text-left min-w-0",
                                selectedLocation === loc.name
                                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                              )}
                            >
                              <span className="font-bold text-sm truncate">{loc.name}</span>
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">{count}</span>
                            </button>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocationToRename(loc.name);
                                  setNewLocationName(loc.name);
                                }}
                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                                title="Переименовать"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocationToDelete(loc.name);
                                }}
                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                                title="Удалить"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      
                    {/* Handle items with no location or location not in list */}
                    {locationSearchQuery === '' && items.some(i => !i.location || !locations.some(l => l.name === i.location)) && (
                      <div className="flex items-center gap-2 group">
                        <button
                          onClick={() => {
                            setSelectedLocation('');
                            setIsLocationModalOpen(false);
                          }}
                          className={cn(
                            "flex-1 flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                            selectedLocation === ''
                              ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                          )}
                        >
                          <span className="font-bold text-sm italic">Без локации / Другие</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">
                            {items.filter(i => !i.location || !locations.some(l => l.name === i.location)).length}
                          </span>
                        </button>
                      </div>
                    )}

                    {locations.filter(loc => loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase())).length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-sm text-slate-500">Локации не найдены</p>
                        <button 
                          onClick={() => {
                            setAddLocationInput(locationSearchQuery);
                            setIsAddingLocation(true);
                          }}
                          className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                        >
                          Создать "{locationSearchQuery}"?
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}

        {locationToRename !== null && (
          <Modal 
            isOpen={true} 
            onClose={() => setLocationToRename(null)} 
            title="Переименовать локацию"
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Это изменит локацию для всех товаров ({items.filter(i => i.location === locationToRename).length} шт.), находящихся в <span className="font-bold text-slate-700 dark:text-slate-300">"{locationToRename || 'Без локации'}"</span>.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Новое название</label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={e => setNewLocationName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-100"
                  placeholder="Напр. Стеллаж B-2"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setLocationToRename(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleRenameLocation(locationToRename, newLocationName)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-200 dark:shadow-none"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </Modal>
        )}

        {locationToDelete !== null && (
          <Modal 
            isOpen={true} 
            onClose={() => setLocationToDelete(null)} 
            title="Удалить локацию"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-sm font-medium">
                  Вы уверены, что хотите удалить локацию <span className="font-bold">"{locationToDelete}"</span>? 
                  Это очистит поле локации у всех товаров ({items.filter(i => i.location === locationToDelete).length} шт.), находящихся в ней.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setLocationToDelete(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDeleteLocation(locationToDelete)}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium shadow-lg shadow-rose-200 dark:shadow-none"
                >
                  Удалить
                </button>
              </div>
            </div>
          </Modal>
        )}

        {isResetConfirmOpen && (
          <Modal 
            isOpen={true} 
            onClose={() => setIsResetConfirmOpen(false)} 
            title="Сбросить все данные"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-sm font-medium">
                  Вы уверены, что хотите сбросить все данные? Это удалит все ваши изменения (товары, локации) и вернет приложение к начальному состоянию. Это действие необратимо.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('warehouse_items');
                    localStorage.removeItem('warehouse_locations');
                    localStorage.removeItem('warehouse_data_version');
                    window.location.reload();
                  }}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium shadow-lg shadow-rose-200 dark:shadow-none"
                >
                  Сбросить всё
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-3 sm:hidden flex justify-around items-center z-40">
        <button 
          onClick={() => { setActiveTab('total'); setIsScannerOpen(false); }} 
          className={cn("p-2 transition-colors", activeTab === 'total' ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")}
        >
          <Layers size={24} />
        </button>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 p-3 rounded-full text-white -mt-10"><Plus size={28} /></button>
        <button 
          onClick={() => { setActiveTab('low'); setIsScannerOpen(false); }} 
          className={cn("p-2 transition-colors", activeTab === 'low' ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500")}
        >
          <AlertCircle size={24} />
        </button>
      </div>
    </div>
  );
}
