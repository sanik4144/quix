import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { HelpCircle, ChevronRight, CheckCircle, AlertCircle, Clock, Award, History, ArrowLeft, RefreshCw } from 'lucide-react';

const QuizInterface = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/student/quizzes/${quizId}`);
                const quizData = res.data;
                // Parse options if they are stringified
                if (quizData.Questions) {
                    quizData.Questions = quizData.Questions.map(q => ({
                        ...q,
                        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
                    }));
                }
                setQuiz(quizData);
                // Set initial time (e.g., 10 minutes or from backend)
                setTimeLeft(quizData.timeLimit ? quizData.timeLimit * 60 : 600); 
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    useEffect(() => {
        let timer;
        if (quizStarted && timeLeft > 0 && !result) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !result) {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [quizStarted, timeLeft, result]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId: questionId,
                selectedOption
            }));
            const res = await api.post(`/student/quizzes/${quizId}/attempt`, { answers: formattedAnswers });
            setResult(res.data);
        } catch (err) {
            alert('Failed to submit quiz');
        }
    };

    if (loading) return <DashboardLayout><div className="flex-center" style={{ height: '50vh' }}>Loading quiz...</div></DashboardLayout>;
    if (!quiz) return <DashboardLayout>Quiz not found</DashboardLayout>;

    if (!quizStarted) {
        return (
            <DashboardLayout>
                <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="icon-box" style={{ width: '80px', height: '80px', background: '#eef2ff', color: 'var(--primary)', margin: '0 auto 2rem' }}>
                            <Award size={40} />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{quiz.title}</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                            Ready to test your knowledge? This quiz contains {quiz.Questions?.length} questions.
                        </p>
                        
                        <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem', textAlign: 'left' }}>
                            <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Limit</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{Math.floor(timeLeft / 60)} Minutes</div>
                            </div>
                            <div className="card" style={{ padding: '1.25rem', background: '#f8fafc' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passing Score</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{quiz.passPercentage}%</div>
                            </div>
                        </div>

                        <button onClick={() => setQuizStarted(true)} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Start Quiz
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (result) {
        const passed = result.status === 'PASS';
        return (
            <DashboardLayout>
                <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div className="icon-box" style={{ 
                            width: '100px', 
                            height: '100px', 
                            margin: '0 auto 2rem',
                            background: passed ? '#dcfce7' : '#fee2e2',
                            color: passed ? '#16a34a' : '#dc2626'
                        }}>
                            {passed ? <CheckCircle size={50} /> : <AlertCircle size={50} />}
                        </div>
                        
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                            {passed ? 'Congratulations!' : 'Keep Working Hard!'}
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                            You scored <strong>{result.score}%</strong> on {quiz.title}
                        </p>

                        <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: passed ? '#16a34a' : '#dc2626' }}>{result.status}</div>
                            </div>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Grade</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{result.score}%</div>
                            </div>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Target</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{quiz.passPercentage}%</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => navigate(-1)} className="btn-primary" style={{ background: 'white', color: 'var(--text)', borderColor: 'var(--border)' }}>
                                <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
                            </button>
                            <button onClick={() => window.location.reload()} className="btn-primary">
                                <RefreshCw size={18} style={{ marginRight: '0.5rem' }} /> Retake Quiz
                            </button>
                            {passed && (
                                <button 
                                    onClick={() => navigate(`/student/certificates/${result.id}`)}
                                    className="btn-primary" 
                                    style={{ background: '#22c55e', borderColor: '#22c55e' }}
                                >
                                    View Certificate
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const question = quiz.Questions[currentQuestion];
    const isAnswered = answers[question.id] !== undefined;

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{quiz.title}</h2>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Question {currentQuestion + 1} of {quiz.Questions.length}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: timeLeft < 60 ? '#fee2e2' : '#f1f5f9', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', color: timeLeft < 60 ? '#dc2626' : 'inherit' }}>
                        <Clock size={20} />
                        <span style={{ fontWeight: '700', fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums' }}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '3rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentQuestion + 1) / quiz.Questions.length) * 100}%`, transition: 'width 0.3s ease' }}></div>
                </div>

                <div className="card" style={{ padding: '3rem' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#eef2ff', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '1rem' }}>
                            QUESTION {currentQuestion + 1}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '600' }}>{question.questionText}</h3>
                    </div>

                    <div className="flex-column" style={{ gap: '1rem' }}>
                        {question.options && (Array.isArray(question.options) ? question.options : JSON.parse(question.options)).map((option, idx) => (
                            <div 
                                key={idx}
                                onClick={() => handleOptionSelect(question.id, idx)}
                                style={{ 
                                    padding: '1.25rem 1.5rem',
                                    border: '2px solid',
                                    borderColor: answers[question.id] === idx ? 'var(--primary)' : 'var(--border)',
                                    borderRadius: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.25rem',
                                    background: answers[question.id] === idx ? '#f5f3ff' : 'white',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    borderRadius: '50%', 
                                    border: '2px solid',
                                    borderColor: answers[question.id] === idx ? 'var(--primary)' : '#cbd5e1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: answers[question.id] === idx ? 'var(--primary)' : 'transparent'
                                }}>
                                    {answers[question.id] === idx && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>}
                                </div>
                                <span style={{ fontSize: '1.1rem', fontWeight: answers[question.id] === idx ? '600' : '400' }}>{option}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex-between" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                        <button 
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(v => v - 1)}
                            className="btn-primary"
                            style={{ background: 'transparent', color: 'var(--text-muted)', borderColor: 'transparent' }}
                        >
                            Previous
                        </button>
                        
                        {currentQuestion === quiz.Questions.length - 1 ? (
                            <button 
                                onClick={handleSubmit}
                                className="btn-primary" 
                                style={{ padding: '1rem 3rem' }}
                                disabled={!isAnswered}
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button 
                                onClick={() => setCurrentQuestion(v => v + 1)}
                                className="btn-primary" 
                                style={{ padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                disabled={!isAnswered}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default QuizInterface;

