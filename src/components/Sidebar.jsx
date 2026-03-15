import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function Sidebar({ isOpen, toggle }) {
  const { data: models = {} } = useQuery({
    queryKey: ['models'],
    queryFn: () => fetch('/api/leads/models').then(r => r.json())
  });

  const { data: funnel = {} } = useQuery({
    queryKey: ['funnel'],
    queryFn: () => fetch('/api/leads/funnel').then(r => r.json())
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-section">
        <div className="sidebar-label">MODELS</div>
        <ul className="sidebar-list">
          {['Punch', 'Nexon', 'Harrier', 'Safari', 'Tiago', 'Curvv', 'Altroz', 'Tiago EV', 'Nexon EV', 'Tigor EV'].map(model => (
            <li key={model} className="sidebar-item">
              <span className={`model-dot model-${model.split(' ')[0].toLowerCase()}`}></span>
              <span className="item-label">{model}</span>
              {models[model] > 0 && <span className="badge">{models[model]}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">STAGE</div>
        <ul className="sidebar-list">
          {['02 Open Green Form', 'Booking Done', 'Test Drive', 'Retailed'].map(stage => (
            <li key={stage} className="sidebar-item">
              <span className={`model-dot stage-dot`}></span>
              <span className="item-label">{stage.replace('02 ', '')}</span>
              {funnel[stage] > 0 && <span className="badge">{funnel[stage]}</span>}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
