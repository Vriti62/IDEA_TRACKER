export default function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Profile</h2>
        <p>Keep your IdeaTracker profile up to date and stay connected to the latest initiative reviews.</p>

        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          <div>
            <strong>Name</strong>
            <p>Guest User</p>
          </div>

          <div>
            <strong>Role</strong>
            <p>Viewer</p>
          </div>

          <div>
            <strong>Notifications</strong>
            <p>Enabled for idea updates and reviewer comments.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
