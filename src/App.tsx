import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { WarehouseItem, ItemFormData, Location } from './types';
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
            <div className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
              <QRCodeSVG 
                value={JSON.stringify({ id: item.id, sku: item.sku, name: item.name })}
                size={16}
                level="L"
              />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{item.name}</h3>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onViewQR(item); }}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <QrCode size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Наличие</p>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xl font-bold",
              item.quantity <= (item.minQuantity ?? 5) ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"
            )}>
              {item.quantity} <span className="text-sm font-medium opacity-70">{item.unit ?? 'шт'}</span>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
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
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const QRScanner = ({ onScan, onClose }: { onScan: (data: string) => void; onClose: () => void }) => {
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isCameraStarted) return;

    const elementId = "qr-reader";
    let isMounted = true;

    const startScanner = async () => {
      setIsInitializing(true);
      setError(null);
      
      try {
        // 1. Check for secure context (HTTPS)
        if (!window.isSecureContext) {
          throw new Error("Камера требует защищенного соединения (HTTPS).");
        }

        // 2. Check for mediaDevices support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Ваш браузер не поддерживает доступ к камере или она заблокирована настройками конфиденциальности.");
        }

        // 3. Warm up camera with direct getUserMedia (iOS workaround)
        // This is now triggered by a user gesture (button click)
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: 'environment' } } 
          });
          stream.getTracks().forEach(track => track.stop());
        } catch (e) {
          console.warn("Camera warmup failed:", e);
          // Don't throw here, let html5-qrcode try its own way
        }

        // Wait for DOM
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;

        const element = document.getElementById(elementId);
        if (!element) {
          throw new Error("Элемент для сканера не найден");
        }

        // Clean up previous instance if any
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch (e) {
            // Ignore stop errors
          }
        }

        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;
        
        const config = { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true
        };

        try {
          // Try back camera first
          await html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            (decodedText: string) => {
              onScan(decodedText);
            },
            () => {}
          );
        } catch (envErr) {
          console.warn("Environment camera failed, trying fallback:", envErr);
          
          const devices = await Html5Qrcode.getCameras().catch(() => []);
          if (devices && devices.length > 0) {
            // Try the last camera (usually back)
            const cameraId = devices[devices.length - 1].id;
            await html5QrCode.start(
              cameraId,
              config,
              (decodedText: string) => {
                onScan(decodedText);
              },
              () => {}
            );
          } else {
            throw new Error("Задняя камера не найдена или доступ к ней запрещен.");
          }
        }
        
        if (isMounted) setIsInitializing(false);

        // Extra fix for iOS: ensure video is playing and visible
        const video = element.querySelector('video');
        if (video) {
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.style.display = "block";
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "cover";
          video.muted = true;
          
          setTimeout(() => {
            video.play().catch(e => console.error("Video play failed", e));
          }, 300);
        }
      } catch (err: any) {
        console.error("Failed to start QR scanner:", err);
        if (isMounted) {
          let msg = "Не удалось запустить камеру.";
          if (err.message?.includes("Permission denied") || err.name === "NotAllowedError") {
            msg = "Доступ к камере отклонен. Пожалуйста, разрешите доступ в настройках браузера.";
          } else if (err.name === "NotFoundError") {
            msg = "Камера не найдена.";
          } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
            msg = "Камера уже используется другим приложением или заблокирована системой.";
          } else if (err.message) {
            msg = err.message;
          } else {
            msg = `Ошибка камеры: ${err.message || "Неизвестная ошибка"}.`;
          }
          setError(msg);
          setIsInitializing(false);
          setIsCameraStarted(false); // Allow user to try again manually
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner:", err));
      }
    };
  }, [onScan, retryCount, isCameraStarted]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          id="qr-reader" 
          key={`qr-reader-${retryCount}`}
          className="overflow-hidden rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 w-full h-[300px] flex items-center justify-center"
        >
          {!isCameraStarted && !error && (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white">Сканер QR-кода</h3>
                <p className="text-sm text-slate-500">Нажмите кнопку ниже, чтобы разрешить доступ к камере и начать сканирование.</p>
              </div>
              <button 
                onClick={() => setIsCameraStarted(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                Включить камеру
              </button>
            </div>
          )}

          {isCameraStarted && isInitializing && !error && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center space-y-2">
                <p className="text-sm text-slate-500">Запуск камеры...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="p-6 text-center space-y-4">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl">
                <AlertCircle className="mx-auto text-rose-500 mb-2" size={32} />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{error}</p>
                
                <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 space-y-3 text-left bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  <p className="font-bold text-rose-600 dark:text-rose-400 border-b border-rose-100 dark:border-rose-900/30 pb-1 mb-2">Если не работает в Safari:</p>
                  <ul className="space-y-2 list-disc pl-4">
                    <li>Убедитесь, что вы <b>не</b> в режиме "Инкогнито".</li>
                    <li>Зайдите в <b>Настройки iPhone</b> → <b>Safari</b> → <b>Камера</b> → выберите <b>"Разрешить"</b>.</li>
                    <li>Если вы видите это сообщение внутри другого приложения (например, Telegram), нажмите кнопку <b>"Открыть в Safari"</b>.</li>
                    {window.self !== window.top && (
                      <li className="text-blue-600 dark:text-blue-400 font-bold">Нажмите кнопку "Открыть в новой вкладке" в углу экрана (справа сверху).</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setIsCameraStarted(true)}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                >
                  Попробовать снова
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Обновить страницу
                </button>
              </div>
            </div>
          )}
        </div>
        {!error && !isInitializing && (
          <div className="absolute inset-0 border-2 border-blue-500/30 rounded-2xl pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 rounded-xl opacity-50"></div>
          </div>
        )}
      </div>
      
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Наведите камеру на QR-код товара
      </p>
      
      <button
        onClick={onClose}
        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
      >
        Закрыть
      </button>
    </div>
  );
};

const ItemForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  existingCategories,
  existingSubclasses,
  existingLocations,
  onAddLocation
}: { 
  initialData?: WarehouseItem; 
  onSubmit: (data: ItemFormData) => void; 
  onCancel: () => void;
  existingCategories: string[];
  existingSubclasses: string[];
  existingLocations: string[];
  onAddLocation?: () => void;
}) => {
  const [formData, setFormData] = useState<ItemFormData>(() => {
    const data = initialData || {
      name: '',
      sku: '',
      quantity: 0,
      minQuantity: 5,
      unit: 'шт',
      specs: '',
      weight: '',
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
      <div className="grid grid-cols-2 gap-4">
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
          <div className="flex gap-2">
            <input
              required
              type="number"
              min="0"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
            <input
              required
              type="text"
              value={formData.unit || 'шт'}
              onChange={e => setFormData({ ...formData, unit: e.target.value })}
              className="w-20 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
              placeholder="ед."
              title="Единица измерения"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Вес</label>
          <input
            type="text"
            value={formData.weight || ''}
            onChange={e => setFormData({ ...formData, weight: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100"
            placeholder="0.5 кг"
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
      <div className="grid grid-cols-2 gap-4">
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
            {existingCategories.map(c => <option key={c} value={c} />)}
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
            {existingSubclasses.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
              {existingLocations.sort().map(l => (
                <option key={l} value={l} />
              ))}
            </datalist>
            {onAddLocation && (
              <button
                type="button"
                onClick={onAddLocation}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
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
    <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
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
          <div className="relative h-64 overflow-hidden bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            <img 
              src={images[activeImageIndex]} 
              alt={item.name}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain drop-shadow-md"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto py-1">
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
      
      <div className="grid grid-cols-2 gap-4 mb-4">
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
              value={JSON.stringify({ id: item.id, sku: item.sku, name: item.name })}
              size={40}
              level="L"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Наличие</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {item.quantity} <span className="text-sm font-medium opacity-70">{item.unit ?? 'шт'}</span>
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

      {item.weight && (
        <div className="flex items-start gap-3">
          <Package className="text-slate-400 mt-1 shrink-0" size={18} />
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Вес</p>
            <p className="text-slate-900 dark:text-slate-100 font-medium">{item.weight}</p>
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

    <div className="flex gap-3 pt-4">
      <button
        onClick={() => { onEdit(item); }}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all font-bold"
      >
        <Edit2 size={18} />
        Редактировать
      </button>
      <button
        onClick={() => { onClose(); onDelete(item); }}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all font-bold"
      >
        <Trash2 size={18} />
        Удалить
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
  
  const [searchQuery, setSearchQuery] = useState('');
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
  };

  const handleRenameLocation = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) {
      setLocationToRename(null);
      return;
    }
    
    // Обновляем товары
    setItems(items.map(item => 
      item.location === oldName ? { ...item, location: newName, updatedAt: Date.now() } : item
    ));
    
    // Обновляем список локаций
    setLocations(locations.map(loc => 
      loc.name === oldName ? { ...loc, name: newName, updatedAt: Date.now() } : loc
    ));

    if (selectedLocation === oldName) setSelectedLocation(newName);
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

  const filteredAndSortedItems = useMemo(() => {
    let result = items
      .filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subclass.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

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

  const toggleSort = (field: 'name' | 'quantity' | 'updatedAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleQRScan = (decodedText: string) => {
    setIsScannerOpen(false);
    try {
      // Try to parse as JSON (our internal format)
      const data = JSON.parse(decodedText);
      
      // If it has an ID, try to find it (Search)
      if (data.id) {
        const item = items.find(i => i.id === data.id);
        if (item) {
          setSearchQuery(item.sku); // Jump to item by SKU
          return;
        }
      }
      
      // If it's a new item or external data, prefill the add form
      setPrefilledData({
        name: data.name || '',
        sku: data.sku || decodedText, // Use raw text as SKU if not JSON
        category: data.category || '',
        subclass: data.subclass || '',
        location: data.location || '',
        quantity: data.quantity || 0,
        minQuantity: data.minQuantity || 5,
        unit: data.unit || 'шт',
        specs: data.specs || '',
        weight: data.weight || '',
        description: data.description || '',
        lastChecked: data.lastChecked || '',
        imageUrl: data.imageUrl || ''
      });
      setIsAddModalOpen(true);
    } catch (e) {
      // If not JSON, treat raw text as SKU for searching or adding
      const item = items.find(i => i.sku === decodedText || i.name === decodedText);
      if (item) {
        setSearchQuery(item.sku);
      } else {
        setPrefilledData({ sku: decodedText });
        setIsAddModalOpen(true);
      }
    }
  };

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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Поиск по названию, SKU, категории..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-100"
            />
          </div>
        </div>

        {/* Dashboard Summary / Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
            <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{items.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between opacity-80">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Общее кол-во</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                <Package className="text-indigo-600 dark:text-indigo-400" size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
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
            <p className="text-3xl font-black text-amber-500 dark:text-amber-400">
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
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
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
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
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

      {/* Modals */}
      <AnimatePresence>
        {isScannerOpen && (
          <Modal isOpen={true} onClose={() => setIsScannerOpen(false)} title="Сканирование QR-кода">
            <QRScanner onScan={handleQRScan} onClose={() => setIsScannerOpen(false)} />
          </Modal>
        )}

        {isAddModalOpen && (
          <Modal isOpen={true} onClose={() => { setIsAddModalOpen(false); setPrefilledData(null); }} title="Добавить новый товар">
            <ItemForm 
              initialData={prefilledData ? { ...prefilledData, id: '', updatedAt: 0 } as WarehouseItem : undefined}
              onSubmit={handleAddItem} 
              onCancel={() => { setIsAddModalOpen(false); setPrefilledData(null); }} 
              existingCategories={Array.from(new Set(items.map(i => i.category).filter(Boolean)))}
              existingSubclasses={Array.from(new Set(items.map(i => i.subclass).filter(Boolean)))}
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
              existingCategories={Array.from(new Set(items.map(i => i.category).filter(Boolean)))}
              existingSubclasses={Array.from(new Set(items.map(i => i.subclass).filter(Boolean)))}
              existingLocations={locations.map(l => l.name)}
              onAddLocation={() => {
                setIsAddingLocation(true);
                setIsLocationModalOpen(true);
              }}
            />
          </Modal>
        )}

        {viewingQR && (
          <Modal isOpen={true} onClose={() => setViewingQR(null)} title="QR-код товара">
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-inner border border-slate-100 dark:border-slate-700">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={JSON.stringify({ 
                    id: viewingQR.id, 
                    sku: viewingQR.sku,
                    name: viewingQR.name,
                    category: viewingQR.category,
                    subclass: viewingQR.subclass,
                    location: viewingQR.location,
                    quantity: viewingQR.quantity,
                    minQuantity: viewingQR.minQuantity,
                    unit: viewingQR.unit,
                    specs: viewingQR.specs,
                    weight: viewingQR.weight,
                    description: viewingQR.description,
                    lastChecked: viewingQR.lastChecked,
                    imageUrl: viewingQR.imageUrl
                  })} 
                  size={200}
                  level="H"
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

        {itemToDelete && (
          <Modal isOpen={true} onClose={() => setItemToDelete(null)} title="Подтверждение удаления">
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-full text-rose-600 mb-2">
                <AlertCircle size={32} />
              </div>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-1">Вы действительно хотите удалить товар:</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{itemToDelete.name}?</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Это действие нельзя будет отменить.</p>
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

        {isCategoryModalOpen && (
          <Modal 
            isOpen={true} 
            onClose={() => setIsCategoryModalOpen(false)} 
            title="Выбор категории и подкласса"
          >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubclass(null);
                  setIsCategoryModalOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  selectedCategory === null ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                )}
              >
                <span className="font-bold">Все категории</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">{items.length}</span>
              </button>
              
              {Array.from(new Set(items.map(i => i.category || 'Без категории')))
                .sort()
                .map(category => {
                  const categoryItems = items.filter(i => (i.category || 'Без категории') === category);
                  const count = categoryItems.length;
                  const subclasses = Array.from(new Set(categoryItems.map(i => i.subclass || 'Без подкласса'))).sort();
                  const isExpanded = expandedCategories.includes(category);

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCategories(prev => 
                              prev.includes(category) 
                                ? prev.filter(c => c !== category) 
                                : [...prev, category]
                            );
                          }}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isExpanded ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                          )}
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category === 'Без категории' ? '' : category);
                            setSelectedSubclass(null);
                            setIsCategoryModalOpen(false);
                          }}
                          className={cn(
                            "flex-1 flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                            (selectedCategory === (category === 'Без категории' ? '' : category) && selectedSubclass === null) 
                              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" 
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                          )}
                        >
                          <span className="font-bold text-sm">{category}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">{count}</span>
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-6 grid grid-cols-1 gap-1 overflow-hidden border-l-2 border-emerald-100 dark:border-emerald-900/50 ml-5 mt-1 mb-2"
                          >
                            {subclasses.map(sub => {
                              const subCount = categoryItems.filter(i => (i.subclass || 'Без подкласса') === sub).length;
                              const subValue = sub === 'Без подкласса' ? '' : sub;
                              const catValue = category === 'Без категории' ? '' : category;
                              
                              return (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    setSelectedCategory(catValue);
                                    setSelectedSubclass(subValue);
                                    setIsCategoryModalOpen(false);
                                  }}
                                  className={cn(
                                    "w-full flex items-center justify-between p-2 pl-4 rounded-lg border transition-all text-sm",
                                    (selectedCategory === catValue && selectedSubclass === subValue)
                                      ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                                      : "bg-white dark:bg-slate-800 border-transparent hover:border-emerald-100 dark:hover:border-emerald-800 text-slate-500 dark:text-slate-400"
                                  )}
                                >
                                  <span>{sub}</span>
                                  <span className="text-[10px] bg-slate-50 dark:bg-slate-900/50 px-1.5 py-0.5 rounded text-slate-400 dark:text-slate-500">{subCount}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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
                                "flex-1 flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                selectedLocation === loc.name
                                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                              )}
                            >
                              <span className="font-bold text-sm">{loc.name}</span>
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500 dark:text-slate-400">{count}</span>
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
