import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings as SettingsIcon, User, Image as ImageIcon, CheckCircle, PenTool, LayoutDashboard, X, ScanFace } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import ReactCrop, { Crop, PixelCrop, makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    taxId: '',
  });

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  // Cropper state
  const [uploadSrc, setUploadSrc] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  const aspect = 1; // Square crop

  const getCroppedImg = () => {
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current!.naturalWidth / imageRef.current!.width;
    const scaleY = imageRef.current!.naturalHeight / imageRef.current!.height;
    
    // Set a max output dimension to prevent oversized base64 strings
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        imageRef.current!,
        completedCrop!.x * scaleX,
        completedCrop!.y * scaleY,
        completedCrop!.width * scaleX,
        completedCrop!.height * scaleY,
        0,
        0,
        size,
        size
      );

      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      setProfilePic(base64Image);
      setIsCropModalOpen(false);
    }
  };

  // Canvas for signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.fullName || user.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            businessName: data.businessName || '',
            taxId: data.taxId || '',
          });
          setProfilePic(data.profilePicture || null);
          setSignature(data.signature || null);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile();
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Check if canvas is empty before saving is complex, but we can assume if they clicked save they drew something
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
  };

  const handleGenerateTaxId = () => {
    navigate('/tin');
  };

  // Auto-save effect
  useEffect(() => {
    if (loading) return;
    const user = auth.currentUser;
    if (!user) return;

    const timeoutId = setTimeout(async () => {
      try {
        setSaving(true);
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          businessName: formData.businessName,
          taxId: formData.taxId,
          profilePicture: profilePic || '',
          signature: signature || '',
          onboardingComplete: true
        }, { merge: true });
        setSuccessMsg("Changes saved automatically.");
        setTimeout(() => setSuccessMsg(''), 2000);
      } catch (err: any) {
        console.error("Auto-save failed", err);
      } finally {
        setSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [formData, profilePic, signature]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        businessName: formData.businessName,
        taxId: formData.taxId,
        profilePicture: profilePic || '',
        signature: signature || '',
        onboardingComplete: true
      }, { merge: true });

      setSuccessMsg("Done! Redirecting to Dashboard...");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm sticky top-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors font-bold">
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <div className="font-bold text-lg text-slate-800">Profile Settings</div>
        <div className="w-[140px]"></div> {/* spacer */}
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-500 font-medium">Manage your personal details, profile image, and tax identification.</p>
          </div>

          {(successMsg || errorMsg) && (
            <motion.div 
              initial={{opacity: 0, y: -10}} animate={{opacity: 1, y:0}} 
              className={`p-4 rounded-xl font-bold flex items-center ${successMsg ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
            >
              {successMsg ? <CheckCircle className="w-5 h-5 mr-2" /> : null}
              {successMsg || errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Profile Image Section */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center sm:space-x-8 space-y-6 sm:space-y-0">
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                {profilePic && (
                  <button 
                    type="button"
                    onClick={() => setProfilePic(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h3 className="font-bold text-slate-900 mb-1 text-lg">Profile Photo</h3>
                <p className="text-sm text-slate-500 mb-4 font-medium max-w-md">Upload a clear photo to help verify your identity. You can crop your face specifically. (Max 2MB)</p>
                <div className="relative bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-6 py-3 font-bold text-emerald-700 cursor-pointer transition-colors inline-flex items-center shadow-sm">
                  <ScanFace className="w-5 h-5 mr-2" />
                  <span>{profilePic ? 'Change Photo' : 'Upload & Crop Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-lg">Personal & Business Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" name="email" value={formData.email} disabled className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Business Name (Optional)</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Tax Details */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-lg flex items-center justify-between">
                <span>Tax Information</span>
              </h3>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-blue-800">
                  If you already have a Tax Identification Number (TIN), enter it below. If you don't have one, you can generate a new one instantly using our integrated NRS system.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tax Identification Number (TIN)</label>
                <div className="flex gap-4">
                  <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="e.g. TIN-12345678" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-mono tracking-wider font-bold text-slate-900 transition-colors" />
                  <button type="button" onClick={handleGenerateTaxId} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors whitespace-nowrap">
                    Generate/Link TIN via NRS
                  </button>
                </div>
              </div>
            </div>

            {/* Accountant Access */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-lg flex items-center justify-between">
                <span>Accountant Access</span>
                <Link to="/accountant-portal" className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer font-bold">
                  Demo: Login as Accountant
                </Link>
              </h3>
              <p className="text-sm text-slate-500 font-medium">Invite a certified accountant or tax consultant to view your books and file taxes on your behalf. They will not have access to your raw bank login details, only the transaction history and receipts.</p>
              
              <div className="flex gap-4">
                <input type="email" placeholder="accountant@example.com" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors" />
                <button type="button" onClick={() => { alert('Invitation sent securely to accountant@example.com'); }} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors whitespace-nowrap">
                  Send Invitation
                </button>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 flex justify-between items-center bg-slate-50">
                 <div>
                    <h4 className="font-bold text-slate-900">Adebayo Ogunlesi (CITN-102934)</h4>
                    <p className="text-xs text-slate-500">Pending acceptance...</p>
                 </div>
                 <button type="button" className="text-rose-600 font-medium text-sm hover:underline">Revoke Access</button>
              </div>
            </div>

            {/* Signature Area */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200 space-y-6">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 text-lg">Digital Signature</h3>
              <p className="text-sm text-slate-500 font-medium">Draw your signature below. This will be used to auto-sign your tax returns and documents.</p>
              
              {signature ? (
                <div className="border-2 border-emerald-500 bg-emerald-50 rounded-xl p-4 inline-block relative">
                  <img src={signature} alt="Saved Signature" className="h-32 object-contain" />
                  <button type="button" onClick={() => setSignature(null)} className="absolute top-2 right-2 text-xs font-bold text-slate-500 hover:text-red-500 bg-white px-2 py-1 rounded shadow-sm">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border border-slate-300 rounded-xl overflow-hidden bg-white w-full max-w-lg cursor-crosshair">
                    <canvas 
                      ref={canvasRef}
                      width={500} 
                      height={200}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseOut={endDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={endDrawing}
                      className="w-full h-auto bg-slate-50 touch-none"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button type="button" onClick={saveSignature} className="px-6 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-xl transition-colors flex items-center">
                      <PenTool className="w-4 h-4 mr-2" />
                      Save Signature
                    </button>
                    <button type="button" onClick={clearSignature} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {saving ? 'Saving Profile...' : 'Save All Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Crop Modal */}
      <AnimatePresence>
        {isCropModalOpen && !!uploadSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold text-slate-900">Crop Your Photo</h3>
                <button 
                  onClick={() => setIsCropModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-slate-50">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  circularCrop
                >
                  <img
                    ref={imageRef}
                    alt="Upload"
                    src={uploadSrc}
                    onLoad={onImageLoad}
                    className="max-h-[50vh] object-contain mx-auto"
                  />
                </ReactCrop>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-4">
                <button 
                  onClick={() => setIsCropModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (completedCrop?.width && completedCrop?.height) {
                      getCroppedImg();
                    } else {
                      setIsCropModalOpen(false);
                      setProfilePic(uploadSrc); // Fallback to full image if no crop
                    }
                  }}
                  className="flex-[2] py-3 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                >
                  Confirm & Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
