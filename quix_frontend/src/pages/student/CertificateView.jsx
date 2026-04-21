import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Award, Download, Printer, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CertificateView = () => {
    const { attemptId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const certificateRef = useRef();

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                // We might need a specific endpoint for attempt details or use quiz attempts
                // For now, let's assume we can fetch by attemptId
                const res = await api.get(`/student/quiz-attempts/${attemptId}`);
                setAttempt(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempt();
    }, [attemptId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading certificate...</div>;
    if (!attempt) return <div className="flex-center" style={{ height: '100vh' }}>Certificate not found</div>;

    const date = new Date(attempt.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="certificate-page" style={{ padding: '2rem', minHeight: '100vh', background: '#f1f5f9' }}>
            <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => navigate(-1)} className="btn-primary" style={{ background: 'white', color: 'var(--text)', borderColor: 'var(--border)' }}>
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
                </button>
                <button onClick={handlePrint} className="btn-primary">
                    <Printer size={18} style={{ marginRight: '0.5rem' }} /> Print Certificate
                </button>
            </div>

            <div 
                ref={certificateRef}
                className="certificate-container" 
                style={{ 
                    maxWidth: '900px', 
                    margin: '0 auto', 
                    background: 'white', 
                    padding: '4rem', 
                    border: '20px solid #1e293b',
                    position: 'relative',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-xl)'
                }}
            >
                {/* Decorative corners */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '2px solid #e2e8f0', pointerEvents: 'none' }}></div>

                <div className="certificate-header" style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award size={46} />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: '#64748b' }}>Certificate of Completion</h2>
                </div>

                <div className="certificate-body">
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#475569' }}>This is to certify that</p>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '2rem', fontFamily: 'serif' }}>
                        {user.fullName}
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: '#475569', lineHeight: '1.6' }}>
                        has successfully completed the course
                    </p>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '3rem' }}>
                        {attempt.Quiz?.Course?.title || 'Professional Development Course'}
                    </h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '4rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '200px', borderBottom: '2px solid #cbd5e1', marginBottom: '0.5rem' }}></div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '700' }}>DATE COMPLETED</div>
                            <div style={{ fontWeight: '600' }}>{date}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                <img src="/logo-placeholder.png" alt="Quix Logo" style={{ height: '30px', opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '700' }}>ISSUED BY</div>
                            <div style={{ fontWeight: '600' }}>Quix Education</div>
                        </div>
                    </div>
                </div>

                <div 
                    style={{ 
                        position: 'absolute', 
                        bottom: '2rem', 
                        right: '2.5rem', 
                        opacity: 0.1, 
                        transform: 'rotate(-15deg)',
                        fontSize: '5rem',
                        fontWeight: '900',
                        pointerEvents: 'none'
                    }}
                >
                    VERIFIED
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .certificate-page { padding: 0 !important; background: white !important; }
                    .certificate-container { 
                        box-shadow: none !important; 
                        border-width: 15px !important;
                        position: fixed !important;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                }
            `}} />
        </div>
    );
};

export default CertificateView;
