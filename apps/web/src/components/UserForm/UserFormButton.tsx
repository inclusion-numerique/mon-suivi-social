export const UserFormButton = ({
  disabled,
  label,
}: {
  label: string
  disabled: boolean
}) => (
  <div className="fr-grid-row fr-mt-12v">
    <div className="fr-col-12">
      <div className="fr-btns-group--inline fr-btns-group">
        <button className="fr-btn" type="submit" disabled={disabled}>
          {label}
        </button>
      </div>
    </div>
  </div>
)
