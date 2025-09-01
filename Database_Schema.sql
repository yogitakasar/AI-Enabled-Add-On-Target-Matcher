-- Portfolio Management System Database Schema
-- This file contains the SQL schema for the Portfolio Management System

-- Create database (adjust as needed for your database system)
-- CREATE DATABASE portfolio_management;
-- USE portfolio_management;

-- Portfolio Companies Table
CREATE TABLE portfolio_companies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    industry VARCHAR(100) NOT NULL,
    description TEXT,
    revenue VARCHAR(20), -- Format: $125M, $50K, $2B
    ebitda VARCHAR(20), -- Format: $38M, $15K, $500M
    employees INT,
    headquarters VARCHAR(200),
    logo VARCHAR(10), -- Emoji or icon reference
    synergy_score DECIMAL(3,1) CHECK (synergy_score >= 0 AND synergy_score <= 10),
    sponsor VARCHAR(100),
    portfolio_duration VARCHAR(100), -- Format: "2 years, 8 months"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_industry (industry),
    INDEX idx_synergy_score (synergy_score),
    INDEX idx_sponsor (sponsor)
);

-- Key Products Table (Many-to-Many relationship with portfolio companies)
CREATE TABLE key_products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    portfolio_company_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_company_id) REFERENCES portfolio_companies(id) ON DELETE CASCADE,
    INDEX idx_portfolio_company (portfolio_company_id)
);

-- Add-on History Table (Many-to-Many relationship with portfolio companies)
CREATE TABLE addon_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    portfolio_company_id BIGINT NOT NULL,
    event_description VARCHAR(500) NOT NULL,
    event_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_company_id) REFERENCES portfolio_companies(id) ON DELETE CASCADE,
    INDEX idx_portfolio_company (portfolio_company_id),
    INDEX idx_event_date (event_date)
);

-- Acquisition Targets Table
CREATE TABLE acquisition_targets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    score DECIMAL(3,1) CHECK (score >= 0 AND score <= 10),
    industry VARCHAR(100),
    revenue VARCHAR(20),
    ebitda VARCHAR(20),
    employees INT,
    headquarters VARCHAR(200),
    synergy_score DECIMAL(3,1) CHECK (synergy_score >= 0 AND synergy_score <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_industry (industry),
    INDEX idx_score (score),
    INDEX idx_synergy_score (synergy_score)
);

-- Target Company Key Products Table
CREATE TABLE target_key_products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    acquisition_target_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (acquisition_target_id) REFERENCES acquisition_targets(id) ON DELETE CASCADE,
    INDEX idx_acquisition_target (acquisition_target_id)
);

-- Target Company Synergies Table
CREATE TABLE target_company_synergies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_company_id BIGINT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL, -- For template compatibility
    industry VARCHAR(100),
    description TEXT,
    revenue VARCHAR(20),
    ebitda VARCHAR(20),
    employees INT,
    headquarters VARCHAR(200),
    synergy_score DECIMAL(3,1) CHECK (synergy_score >= 0 AND synergy_score <= 10),
    sponsor VARCHAR(100),
    portfolio_duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (target_company_id) REFERENCES acquisition_targets(id) ON DELETE CASCADE,
    INDEX idx_company_name (company_name),
    INDEX idx_industry (industry),
    INDEX idx_synergy_score (synergy_score)
);

-- Synergy Details Table
CREATE TABLE synergy_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_company_synergy_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., "Product Integration", "Market Expansion"
    description TEXT,
    impact ENUM('High', 'Medium', 'Low') NOT NULL,
    timeline VARCHAR(100), -- e.g., "6-12 months"
    value VARCHAR(200), -- e.g., "$15M annual revenue increase"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_company_synergy_id) REFERENCES target_company_synergies(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_impact (impact)
);

-- Financial Metrics Table
CREATE TABLE financial_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_company_synergy_id BIGINT NOT NULL,
    valuation VARCHAR(20), -- e.g., "$120M"
    multiple VARCHAR(20), -- e.g., "4.3x EBITDA"
    growth_rate VARCHAR(20), -- e.g., "25% YoY"
    profit_margin VARCHAR(20), -- e.g., "33%"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_company_synergy_id) REFERENCES target_company_synergies(id) ON DELETE CASCADE
);

-- Risks Table
CREATE TABLE risks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_company_synergy_id BIGINT NOT NULL,
    risk_description VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_company_synergy_id) REFERENCES target_company_synergies(id) ON DELETE CASCADE
);

-- Target Company Add-on History Table
CREATE TABLE target_addon_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_company_synergy_id BIGINT NOT NULL,
    event_description VARCHAR(500) NOT NULL,
    event_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_company_synergy_id) REFERENCES target_company_synergies(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date)
);

-- Portfolio Company - Acquisition Target Relationships Table
CREATE TABLE portfolio_acquisition_relationships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    portfolio_company_id BIGINT NOT NULL,
    acquisition_target_id BIGINT NOT NULL,
    relationship_type ENUM('potential', 'evaluating', 'approved', 'rejected') DEFAULT 'potential',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_company_id) REFERENCES portfolio_companies(id) ON DELETE CASCADE,
    FOREIGN KEY (acquisition_target_id) REFERENCES acquisition_targets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_relationship (portfolio_company_id, acquisition_target_id),
    INDEX idx_portfolio_company (portfolio_company_id),
    INDEX idx_acquisition_target (acquisition_target_id),
    INDEX idx_relationship_type (relationship_type)
);

-- Sample Data Insertion

-- Insert sample portfolio companies
INSERT INTO portfolio_companies (id, name, icon, industry, description, revenue, ebitda, employees, headquarters, logo, synergy_score, sponsor, portfolio_duration) VALUES
(1, 'OptiCore Solutions', 'business', 'Enterprise Software', 'OptiCore Solutions is a leading provider of cloud-based project management and collaboration software. Our platform offers comprehensive tools for task tracking, team communication, and project analytics, helping organizations streamline their workflows and improve productivity and efficiency.', '$125M', '$38M', 450, 'San Francisco, CA', '🏢', 8.5, 'TechVentures Capital', '2 years, 8 months'),
(2, 'DataStream Analytics', 'analytics', 'Data Analytics', 'DataStream Analytics specializes in real-time data processing and business intelligence solutions. We help organizations transform raw data into actionable insights through advanced analytics, machine learning, and interactive dashboards.', '$85M', '$28M', 320, 'Austin, TX', '📊', 9.2, 'Innovation Partners', '1 year, 11 months'),
(3, 'TechForge Dynamics', 'build', 'Technology Services', 'TechForge Dynamics is a full-service technology consulting firm that helps businesses modernize their IT infrastructure, implement cloud solutions, and develop custom software applications.', '$95M', '$32M', 380, 'Seattle, WA', '⚡', 8.8, 'Growth Capital Partners', '3 years, 2 months'),
(4, 'Apex Analytics', 'trending_up', 'Business Intelligence', 'Apex Analytics provides enterprise-grade business intelligence and reporting solutions. Our platform enables data-driven decision making through advanced analytics, predictive modeling, and real-time reporting.', '$110M', '$35M', 420, 'Boston, MA', '🌱', 8.3, 'Strategic Growth Fund', '2 years, 5 months'),
(5, 'Quantum Ventures', 'rocket_launch', 'Investment', 'Quantum Ventures is a private equity firm focused on technology investments. We partner with innovative companies to accelerate growth and create long-term value through strategic guidance and capital.', '$200M', '$65M', 150, 'New York, NY', '🌍', 7.8, 'Legacy Capital Group', '5 years, 3 months'),
(6, 'Pinnacle Holdings', 'account_balance', 'Holding Company', 'Pinnacle Holdings is a diversified holding company with investments across technology, healthcare, and financial services sectors. We provide strategic oversight and operational support to our portfolio companies.', '$350M', '$120M', 280, 'Chicago, IL', '🔗', 8.1, 'Heritage Investment Group', '4 years, 7 months');

-- Insert sample acquisition targets
INSERT INTO acquisition_targets (id, name, description, score, industry, revenue, ebitda, employees, headquarters, synergy_score) VALUES
(1, 'DataStream Analytics', 'Real-time data processing and business intelligence solutions', 9.2, 'Data Analytics', '$85M', '$28M', 320, 'Austin, TX', 9.2),
(2, 'TaskFlow Automation', 'Provides intelligent workflow automation solutions', 8.8, 'Business Process Automation', '$65M', '$22M', 280, 'Denver, CO', 8.8),
(3, 'CollaboraHub AI', 'Develops AI-powered assistants for team collaboration', 8.5, 'Collaboration Software', '$75M', '$25M', 350, 'Seattle, WA', 8.5),
(4, 'SecureVault Docs', 'Offers encrypted document management and version control', 8.9, 'Document Management', '$90M', '$30M', 400, 'Boston, MA', 8.9),
(5, 'AgileSprint Integrations', 'Focuses on building custom API integrations for Agile development tools', 8.7, 'Integration Services', '$70M', '$24M', 320, 'San Diego, CA', 8.7);

-- Insert sample key products for portfolio companies
INSERT INTO key_products (portfolio_company_id, product_name) VALUES
(1, 'Cloud Project Management'),
(1, 'Team Collaboration Tools'),
(1, 'Project Analytics Platform'),
(1, 'Workflow Automation'),
(2, 'Real-time Analytics Platform'),
(2, 'Machine Learning Models'),
(2, 'Business Intelligence Tools'),
(2, 'Data Visualization Suite'),
(3, 'IT Infrastructure Consulting'),
(3, 'Cloud Migration Services'),
(3, 'Custom Software Development'),
(3, 'Digital Transformation'),
(4, 'Business Intelligence Platform'),
(4, 'Predictive Analytics Engine'),
(4, 'Real-time Reporting Tools'),
(4, 'Data Warehouse Solutions'),
(5, 'Growth Capital Investment'),
(5, 'Strategic Advisory Services'),
(5, 'Portfolio Management'),
(5, 'Exit Strategy Planning'),
(6, 'Strategic Portfolio Management'),
(6, 'Operational Excellence Programs'),
(6, 'Cross-sector Synergies'),
(6, 'Risk Management Services');

-- Insert sample add-on history for portfolio companies
INSERT INTO addon_history (portfolio_company_id, event_description, event_date) VALUES
(1, '2022: Initial acquisition', '2022-01-15'),
(1, '2023: Launched cloud platform', '2023-03-20'),
(1, '2024: Expanded to enterprise clients', '2024-01-10'),
(2, '2023: Strategic acquisition', '2023-06-15'),
(2, '2024: Launched AI-powered analytics', '2024-02-28'),
(3, '2021: Initial acquisition', '2021-09-10'),
(3, '2022: Launched cloud services division', '2022-11-15'),
(3, '2023: Expanded to enterprise clients', '2023-07-22'),
(3, '2024: Acquired AI consulting firm', '2024-01-05'),
(4, '2022: Strategic acquisition', '2022-04-12'),
(4, '2023: Launched predictive analytics', '2023-08-30'),
(4, '2024: Expanded to healthcare sector', '2024-03-15'),
(5, '2019: Fund establishment', '2019-01-01'),
(5, '2020: First portfolio investment', '2020-03-15'),
(5, '2021: Strategic partnerships formed', '2021-06-20'),
(5, '2022: Portfolio expansion', '2022-09-10'),
(5, '2023: Successful exits', '2023-12-05'),
(5, '2024: New fund launch', '2024-01-20'),
(6, '2020: Company formation', '2020-02-01'),
(6, '2021: First acquisitions', '2021-05-15'),
(6, '2022: Operational improvements', '2022-08-20'),
(6, '2023: Portfolio optimization', '2023-11-10'),
(6, '2024: Strategic divestitures', '2024-02-28');

-- Insert sample target company key products
INSERT INTO target_key_products (acquisition_target_id, product_name) VALUES
(1, 'Real-time Analytics Platform'),
(1, 'Machine Learning Models'),
(1, 'Business Intelligence Tools'),
(1, 'Data Visualization Suite'),
(2, 'Workflow Automation Engine'),
(2, 'Process Mining Tools'),
(2, 'RPA Platform'),
(2, 'Business Process Analytics'),
(3, 'AI Chat Assistant'),
(3, 'Smart Document Collaboration'),
(3, 'Team Analytics Dashboard'),
(3, 'Workflow Intelligence'),
(4, 'Secure Document Storage'),
(4, 'Advanced Encryption'),
(4, 'Compliance Management'),
(4, 'Document Workflow'),
(5, 'API Gateway'),
(5, 'Workflow Orchestration'),
(5, 'Data Transformation'),
(5, 'Integration Analytics');

-- Insert sample portfolio-acquisition relationships
INSERT INTO portfolio_acquisition_relationships (portfolio_company_id, acquisition_target_id, relationship_type) VALUES
(1, 1, 'potential'),
(1, 2, 'potential'),
(1, 3, 'potential'),
(1, 4, 'potential'),
(1, 5, 'potential');

-- Create views for easier querying

-- View for portfolio companies with their key products
CREATE VIEW portfolio_companies_with_products AS
SELECT 
    pc.*,
    GROUP_CONCAT(kp.product_name SEPARATOR ', ') as key_products_list
FROM portfolio_companies pc
LEFT JOIN key_products kp ON pc.id = kp.portfolio_company_id
GROUP BY pc.id;

-- View for portfolio companies with their add-on history
CREATE VIEW portfolio_companies_with_history AS
SELECT 
    pc.*,
    GROUP_CONCAT(ah.event_description ORDER BY ah.event_date SEPARATOR '; ') as addon_history_list
FROM portfolio_companies pc
LEFT JOIN addon_history ah ON pc.id = ah.portfolio_company_id
GROUP BY pc.id;

-- View for acquisition targets with their key products
CREATE VIEW acquisition_targets_with_products AS
SELECT 
    at.*,
    GROUP_CONCAT(tkp.product_name SEPARATOR ', ') as key_products_list
FROM acquisition_targets at
LEFT JOIN target_key_products tkp ON at.id = tkp.acquisition_target_id
GROUP BY at.id;

-- Stored Procedures

-- Procedure to get portfolio company with acquisition targets
DELIMITER //
CREATE PROCEDURE GetPortfolioCompanyWithTargets(
    IN company_id BIGINT,
    IN company_name VARCHAR(100)
)
BEGIN
    SELECT 
        pc.*,
        GROUP_CONCAT(kp.product_name SEPARATOR ', ') as key_products_list,
        GROUP_CONCAT(ah.event_description ORDER BY ah.event_date SEPARATOR '; ') as addon_history_list
    FROM portfolio_companies pc
    LEFT JOIN key_products kp ON pc.id = kp.portfolio_company_id
    LEFT JOIN addon_history ah ON pc.id = ah.portfolio_company_id
    WHERE pc.id = company_id AND pc.name = company_name
    GROUP BY pc.id;
    
    SELECT 
        at.*,
        GROUP_CONCAT(tkp.product_name SEPARATOR ', ') as key_products_list
    FROM acquisition_targets at
    LEFT JOIN target_key_products tkp ON at.id = tkp.acquisition_target_id
    LEFT JOIN portfolio_acquisition_relationships par ON at.id = par.acquisition_target_id
    WHERE par.portfolio_company_id = company_id
    GROUP BY at.id;
END //
DELIMITER ;

-- Procedure to get target company synergies
DELIMITER //
CREATE PROCEDURE GetTargetCompanySynergies(
    IN buyer_company_id BIGINT,
    IN target_company_id VARCHAR(10)
)
BEGIN
    DECLARE target_id BIGINT;
    
    -- Extract numeric ID from target company ID (e.g., T1 -> 1)
    SET target_id = CAST(SUBSTRING(target_company_id, 2) AS UNSIGNED);
    
    SELECT 
        tcs.*,
        GROUP_CONCAT(tkp.product_name SEPARATOR ', ') as key_products_list,
        GROUP_CONCAT(tah.event_description ORDER BY tah.event_date SEPARATOR '; ') as addon_history_list
    FROM target_company_synergies tcs
    LEFT JOIN target_key_products tkp ON tcs.target_company_id = tkp.acquisition_target_id
    LEFT JOIN target_addon_history tah ON tcs.id = tah.target_company_synergy_id
    WHERE tcs.target_company_id = target_id
    GROUP BY tcs.id;
    
    SELECT 
        sd.*
    FROM synergy_details sd
    JOIN target_company_synergies tcs ON sd.target_company_synergy_id = tcs.id
    WHERE tcs.target_company_id = target_id;
    
    SELECT 
        fm.*
    FROM financial_metrics fm
    JOIN target_company_synergies tcs ON fm.target_company_synergy_id = tcs.id
    WHERE tcs.target_company_id = target_id;
    
    SELECT 
        r.risk_description
    FROM risks r
    JOIN target_company_synergies tcs ON r.target_company_synergy_id = tcs.id
    WHERE tcs.target_company_id = target_id;
END //
DELIMITER ;

-- Indexes for performance optimization
CREATE INDEX idx_portfolio_companies_name ON portfolio_companies(name);
CREATE INDEX idx_acquisition_targets_name ON acquisition_targets(name);
CREATE INDEX idx_key_products_name ON key_products(product_name);
CREATE INDEX idx_target_key_products_name ON target_key_products(product_name);
CREATE INDEX idx_synergy_details_type ON synergy_details(type);
CREATE INDEX idx_synergy_details_impact ON synergy_details(impact);

-- Comments for documentation
COMMENT ON TABLE portfolio_companies IS 'Main table storing portfolio company information';
COMMENT ON TABLE acquisition_targets IS 'Table storing potential acquisition targets';
COMMENT ON TABLE target_company_synergies IS 'Detailed synergy information for acquisition targets';
COMMENT ON TABLE synergy_details IS 'Specific synergy details and their impact';
COMMENT ON TABLE financial_metrics IS 'Financial performance metrics for target companies';
COMMENT ON TABLE risks IS 'Risk factors associated with acquisition targets';
COMMENT ON TABLE portfolio_acquisition_relationships IS 'Relationships between portfolio companies and acquisition targets';
