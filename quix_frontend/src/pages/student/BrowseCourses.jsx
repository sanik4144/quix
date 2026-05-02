import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrowseCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
        pricing: ''
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/student/courses');
                setCourses(res.data);
                setFilteredCourses(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        let result = courses.filter(c => 
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
        );

        if (filters.category) result = result.filter(c => c.category === filters.category);
        if (filters.difficulty) result = result.filter(c => c.difficulty === filters.difficulty);
        if (filters.pricing) {
            if (filters.pricing === 'Free') result = result.filter(c => c.pricing === 0);
            if (filters.pricing === 'Paid') result = result.filter(c => c.pricing > 0);
        }

        setFilteredCourses(result);
    }, [search, filters, courses]);

    const categories = [...new Set(courses.map(c => c.category))];

    if (loading) return <DashboardLayout><p>Loading courses...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="page-header">
                <h1>Explore Courses</h1>
                <p>Discover new skills from expert instructors.</p>
            </div>

            <div className="filter-bar">
                <div className="search-input" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <select 
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select 
                    className="filter-select"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                >
                    <option value="">All Difficulties</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>

                <select 
                    className="filter-select"
                    value={filters.pricing}
                    onChange={(e) => setFilters({...filters, pricing: e.target.value})}
                >
                    <option value="">All Pricing</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                </select>
            </div>

            <div className="grid-3">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="card card-hover course-card">
                        <div style={{ height: '180px', background: '#e2e8f0', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <BookOpen size={48} />
                        </div>
                        <div className="course-card-content">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', textTransform: 'uppercase' }}>{course.category}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.difficulty}</span>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.75rem' }}>{course.title}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {course.description}
                            </p>
                            
                            <div className="course-card-meta">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '700', color: '#1e293b' }}>
                                    {course.pricing === 0 ? 'Free' : `$${course.pricing}`}
                                </div>
                                <button 
                                    onClick={() => navigate(`/student/courses/${course.id}`)}
                                    className="btn-primary" 
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCourses.length === 0 && (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.3 }} />
                        <p style={{ color: 'var(--text-muted)' }}>No courses found matching your criteria.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BrowseCourses;

