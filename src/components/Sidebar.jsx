export default function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onLogout
}) {

  return (
    <>
      {/* Trigger button for sidebar */}
      <button
        className="sidebar-trigger"
        onClick={onToggleCollapse}
        aria-label="Toggle sidebar"
      >
        <span className="sidebar-trigger-icon">☰</span>
      </button>
      
      <aside 
        className={`sidebar ${!collapsed ? "visible" : ""} ${collapsed ? "collapsed" : ""}`}
      >
        <div className="sidebar-card">
          <div className="sidebar-header">
            <div className="sidebar-avatar">TM</div>
            {!collapsed && (
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">Tata Motors</span>
                <span className="sidebar-user-email">Lead Ops Desk</span>
              </div>
            )}
          </div>

          <div className="sidebar-actions">
            <button
              className="btn muted logout-btn"
              type="button"
              onClick={onLogout}
            >
              Log out
            </button>
            <button
              className="btn subtle"
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? "→" : "←"} {collapsed ? "Open" : "Collapse"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
