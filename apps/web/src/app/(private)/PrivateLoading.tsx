import { Spinner } from '@mss/web/ui/Spinner'

const PrivateLoading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: 600,
        flex: 1,
      }}
    >
      <Spinner />
    </div>
  )
}

export default PrivateLoading
